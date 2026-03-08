/**
 * md-parser.js
 * Parses templates.md and templates_5sentences.md into structured quest data.
 * Works in both Node.js and browser environments.
 */

const MdParser = (() => {

  // Section header pattern: ## N. emoji Name (Korean Name)
  const SECTION_HEADER_RE = /^## (\d+)\.\s*(\S+)\s*(.+?)\s*\((.+?)\)\s*$/;

  // Numbered template line: N. sentence text
  const TEMPLATE_LINE_RE = /^(\d+)\.\s+(.+)$/;

  // Quest header: ### emoji Quest N. [Template: pattern]
  const QUEST_HEADER_RE = /^###\s*\S+\s*Quest\s+(\d+)\.\s*\[Template:\s*(.+?)\]\s*$/;

  // Extract all bracketed content [text]
  function extractBrackets(text) {
    const re = /\[([^\]]+)\]/g;
    const results = [];
    let match;
    while ((match = re.exec(text)) !== null) {
      results.push(match[1]);
    }
    return results;
  }

  // Strip markdown bold markers
  function stripBold(text) {
    return text.replace(/\*\*/g, '');
  }

  // Create display text with blanks replacing bracket content
  function createBlankText(text) {
    return stripBold(text).replace(/\[([^\]]+)\]/g, '____');
  }

  /**
   * Parse templates.md
   * Returns: Map<number, { id, sectionId, sectionEmoji, sectionNameEn, sectionNameKr, fullText, brackets }>
   */
  function parseTemplatesMd(markdown) {
    const lines = markdown.split(/\r?\n/);
    const templates = new Map();
    let currentSection = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      // Check for section header
      const sectionMatch = trimmed.match(SECTION_HEADER_RE);
      if (sectionMatch) {
        currentSection = {
          id: parseInt(sectionMatch[1]),
          emoji: sectionMatch[2],
          nameEn: sectionMatch[3].trim(),
          nameKr: sectionMatch[4].trim()
        };
        continue;
      }

      // Check for numbered template line
      const templateMatch = trimmed.match(TEMPLATE_LINE_RE);
      if (templateMatch && currentSection) {
        const id = parseInt(templateMatch[1]);
        const fullText = templateMatch[2].trim();
        const cleanText = stripBold(fullText);
        const brackets = extractBrackets(cleanText);

        templates.set(id, {
          id,
          sectionId: currentSection.id,
          sectionEmoji: currentSection.emoji,
          sectionNameEn: currentSection.nameEn,
          sectionNameKr: currentSection.nameKr,
          fullText: cleanText,
          brackets
        });
      }
    }

    return templates;
  }

  /**
   * Parse a quest block (lines between headers) into 5 sentences.
   * Handles two patterns:
   *   Pattern A: Lines = [s1, s2, s3, "4. **bold** 5. text"] → template at index 3
   *   Pattern B: Lines = [s1, "3. **bold** 4. text", s5]     → template at index 2
   */
  function parseQuestSentences(contentLines) {
    const sentences = [];
    let templateSentenceIndex = -1;

    for (let i = 0; i < contentLines.length; i++) {
      const line = contentLines[i].trim();
      if (!line) continue;

      // Check if this line contains bold markers (template sentence) AND might have merged sentences
      if (line.includes('**')) {
        // Try to split merged sentences: "N. **bold text** N+1. other text"
        // or "N. other text N+1. **bold text**"

        // Pattern: bold sentence first, then another sentence follows
        const mergedBoldFirst = line.match(/^(\d+)\.\s*(\*\*.+?\*\*)\s+(\d+)\.\s*(.+)$/);
        // Pattern: non-bold first, then bold
        const mergedBoldSecond = line.match(/^(\d+)\.\s*([^*].+?)\s+(\d+)\.\s*(\*\*.+?\*\*)$/);

        if (mergedBoldFirst) {
          const boldNum = parseInt(mergedBoldFirst[1]);
          const boldText = mergedBoldFirst[2];
          const otherNum = parseInt(mergedBoldFirst[3]);
          const otherText = mergedBoldFirst[4];

          const cleanBold = stripBold(boldText);
          const blanks = extractBrackets(cleanBold);
          const displayText = createBlankText(boldText);

          templateSentenceIndex = sentences.length;
          sentences.push({
            num: boldNum,
            text: cleanBold,
            displayText,
            isTemplate: true,
            blanks
          });
          sentences.push({
            num: otherNum,
            text: otherText,
            displayText: otherText,
            isTemplate: false
          });
        } else if (mergedBoldSecond) {
          const otherNum = parseInt(mergedBoldSecond[1]);
          const otherText = mergedBoldSecond[2];
          const boldNum = parseInt(mergedBoldSecond[3]);
          const boldText = mergedBoldSecond[4];

          const cleanBold = stripBold(boldText);
          const blanks = extractBrackets(cleanBold);
          const displayText = createBlankText(boldText);

          sentences.push({
            num: otherNum,
            text: otherText,
            displayText: otherText,
            isTemplate: false
          });
          templateSentenceIndex = sentences.length;
          sentences.push({
            num: boldNum,
            text: cleanBold,
            displayText,
            isTemplate: true,
            blanks
          });
        } else {
          // Single bold sentence on its own line
          const singleMatch = line.match(/^(\d+)\.\s*(\*\*.+?\*\*)$/);
          if (singleMatch) {
            const num = parseInt(singleMatch[1]);
            const boldText = singleMatch[2];
            const cleanBold = stripBold(boldText);
            const blanks = extractBrackets(cleanBold);
            const displayText = createBlankText(boldText);

            templateSentenceIndex = sentences.length;
            sentences.push({
              num,
              text: cleanBold,
              displayText,
              isTemplate: true,
              blanks
            });
          } else {
            // Bold markers present but not matching patterns - treat as regular with bold stripped
            const simpleMatch = line.match(/^(\d+)\.\s+(.+)$/);
            if (simpleMatch) {
              const num = parseInt(simpleMatch[1]);
              const rawText = simpleMatch[2];
              const cleanText = stripBold(rawText);
              const blanks = extractBrackets(cleanText);

              if (blanks.length > 0 || rawText.includes('**')) {
                const displayText = createBlankText(rawText);
                templateSentenceIndex = sentences.length;
                sentences.push({
                  num,
                  text: cleanText,
                  displayText,
                  isTemplate: true,
                  blanks
                });
              } else {
                sentences.push({
                  num,
                  text: cleanText,
                  displayText: cleanText,
                  isTemplate: false
                });
              }
            }
          }
        }
      } else {
        // Regular non-bold sentence
        const simpleMatch = line.match(/^(\d+)\.\s+(.+)$/);
        if (simpleMatch) {
          sentences.push({
            num: parseInt(simpleMatch[1]),
            text: simpleMatch[2].trim(),
            displayText: simpleMatch[2].trim(),
            isTemplate: false
          });
        }
      }
    }

    return { sentences, templateSentenceIndex };
  }

  /**
   * Parse templates_5sentences.md
   * Returns: Map<number, QuestEntry>
   */
  function parseTemplates5SentencesMd(markdown) {
    const lines = markdown.split(/\r?\n/);
    const quests = new Map();
    let currentSectionName = '';
    let currentSectionId = 0;
    let currentQuestId = null;
    let currentTemplatePattern = '';
    let currentContentLines = [];

    function flushQuest() {
      if (currentQuestId !== null && currentContentLines.length > 0) {
        const { sentences, templateSentenceIndex } = parseQuestSentences(currentContentLines);
        const type = sentences.some(s => s.isTemplate && s.blanks && s.blanks.length > 0)
          ? 'fill-in' : 'fixed';

        quests.set(currentQuestId, {
          id: currentQuestId,
          templatePattern: currentTemplatePattern,
          sentences,
          templateSentenceIndex,
          type
        });
      }
    }

    for (const line of lines) {
      const trimmed = line.trim();

      // Section title line (starts with # but not ###)
      if (/^# [^#]/.test(trimmed)) {
        // Extract section info from title like "# 🦄 Yuna's 5-Sentence Magic Quests: Opinion Writing (1~28)"
        const sectionTitleMatch = trimmed.match(/:\s*(.+?)\s*\((\d+)/);
        if (sectionTitleMatch) {
          currentSectionName = sectionTitleMatch[1].trim();
        }
        continue;
      }

      // Quest header
      const questMatch = trimmed.match(QUEST_HEADER_RE);
      if (questMatch) {
        flushQuest();
        currentQuestId = parseInt(questMatch[1]);
        currentTemplatePattern = questMatch[2].trim();
        currentContentLines = [];
        continue;
      }

      // Content lines (numbered sentences)
      if (currentQuestId !== null && /^\d+\./.test(trimmed)) {
        currentContentLines.push(trimmed);
      }
    }

    // Flush last quest
    flushQuest();
    return quests;
  }

  /**
   * Merge templates and 5-sentence quests into final quest data structure
   */
  function mergeToQuestData(templates, quests5) {
    // Build sections from templates
    const sectionsMap = new Map();

    for (const [id, tmpl] of templates) {
      if (!sectionsMap.has(tmpl.sectionId)) {
        sectionsMap.set(tmpl.sectionId, {
          id: tmpl.sectionId,
          emoji: tmpl.sectionEmoji,
          nameEn: tmpl.sectionNameEn,
          nameKr: tmpl.sectionNameKr,
          quests: []
        });
      }

      const quest5 = quests5.get(id);
      if (!quest5) continue;

      const questEntry = {
        id,
        sectionId: tmpl.sectionId,
        templatePattern: quest5.templatePattern,
        templateFull: tmpl.fullText,
        templateBrackets: tmpl.brackets,
        sentences: quest5.sentences,
        templateSentenceIndex: quest5.templateSentenceIndex,
        type: quest5.type
      };

      sectionsMap.get(tmpl.sectionId).quests.push(questEntry);
    }

    // Sort sections and quests
    const sections = Array.from(sectionsMap.values())
      .sort((a, b) => a.id - b.id);

    for (const section of sections) {
      section.quests.sort((a, b) => a.id - b.id);
    }

    return {
      version: 1,
      totalQuests: templates.size,
      sections
    };
  }

  /**
   * Main entry: parse both markdown files and return quest data
   */
  function parse(templatesMd, templates5Md) {
    const templates = parseTemplatesMd(templatesMd);
    const quests5 = parseTemplates5SentencesMd(templates5Md);
    return mergeToQuestData(templates, quests5);
  }

  return {
    parse,
    parseTemplatesMd,
    parseTemplates5SentencesMd,
    mergeToQuestData,
    extractBrackets,
    stripBold,
    createBlankText
  };

})();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MdParser;
}
