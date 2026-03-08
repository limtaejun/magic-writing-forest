/**
 * quest-engine.js
 * Core quest logic: loading, rendering, and grading.
 */

class QuestEngine {
  constructor(questData, progressTracker) {
    this.data = questData;
    this.progress = progressTracker;
    this.currentQuest = null;
    this.currentSection = null;

    // Feedback messages per tier
    this.feedbackMessages = {
      perfect: [
        "Absolutely magical! You nailed it! ✨",
        "You're a writing wizard! 🧙‍♀️",
        "Pony-rific! Perfect answer! 🦄",
        "Amazing! Twilight Sparkle would be proud! 📚",
        "Purr-fect! You're a star! ⭐",
        "Incredible work, Yuna! 🌟"
      ],
      close: [
        "Almost there! Try one more time! 💪",
        "So close! Check your spelling! ✏️",
        "You're really close! Look at it again! 🔍"
      ],
      creative: [
        "What a creative answer! Here's your star! 🌈",
        "Great thinking! That works too! 💡",
        "Love your imagination! Keep it up! 🎨",
        "Wonderful idea! You're so creative! 🦋"
      ]
    };
  }

  /** Get all sections */
  getSections() {
    return this.data.sections;
  }

  /** Get a specific section */
  getSection(sectionId) {
    return this.data.sections.find(s => s.id === sectionId);
  }

  /** Get a specific quest */
  getQuest(questId) {
    for (const section of this.data.sections) {
      const quest = section.quests.find(q => q.id === questId);
      if (quest) return quest;
    }
    return null;
  }

  /** Get quests in a section */
  getQuestsBySection(sectionId) {
    const section = this.getSection(sectionId);
    return section ? section.quests : [];
  }

  /** Get next uncompleted quest in a section (or overall) */
  getNextUncompletedQuest(sectionId) {
    const sections = sectionId
      ? [this.getSection(sectionId)]
      : this.data.sections;

    for (const section of sections) {
      if (!section) continue;
      for (const quest of section.quests) {
        const status = this.progress.getQuestStatus(quest.id);
        if (!status || !status.completed) {
          return quest;
        }
      }
    }
    return null;
  }

  /** Render quest sentences into a container element */
  renderQuest(quest, container) {
    this.currentQuest = quest;
    const section = this.data.sections.find(s => s.id === quest.sectionId);
    this.currentSection = section;

    container.innerHTML = '';

    // Quest header
    const header = document.createElement('div');
    header.className = 'quest-header';
    header.innerHTML = `
      <span class="quest-section-badge">${section ? section.emoji : '📝'} ${section ? section.nameEn : ''}</span>
      <h2 class="quest-title">Quest ${quest.id}</h2>
      <p class="quest-template-hint">${quest.templatePattern}</p>
    `;
    container.appendChild(header);

    // Sentences container (the scroll)
    const scroll = document.createElement('div');
    scroll.className = 'quest-scroll';

    const inputRefs = [];

    quest.sentences.forEach((sentence, idx) => {
      const sentenceEl = document.createElement('div');
      sentenceEl.className = 'quest-sentence' + (sentence.isTemplate ? ' quest-sentence--template' : '');
      sentenceEl.dataset.index = idx;

      if (sentence.isTemplate && sentence.blanks && sentence.blanks.length > 0) {
        // Render template sentence with input fields
        const html = this._renderTemplateWithInputs(sentence, inputRefs);
        sentenceEl.innerHTML = `<span class="sentence-num">${sentence.num}.</span> ${html}`;
      } else {
        // Regular sentence
        sentenceEl.innerHTML = `<span class="sentence-num">${sentence.num}.</span> <span class="sentence-text">${sentence.displayText || sentence.text}</span>`;
      }

      scroll.appendChild(sentenceEl);
    });

    container.appendChild(scroll);

    // Character sidebar
    const characterKey = quest.sentences.map(s => s.text || '').join(' ').toLowerCase().includes('pony') ? 'sparkle-wing' : 'writing';
    const charDisplay = AnimationController.createCharacterDisplay(characterKey);
    container.appendChild(charDisplay);

    // Apply typewriter effect
    if (typeof AnimationController !== 'undefined') {
      AnimationController.typewriterSentences(scroll);
      AnimationController.addSparkles(scroll, 6);
    }

    // Submit button
    const actions = document.createElement('div');
    actions.className = 'quest-actions';

    if (quest.type === 'fill-in') {
      const submitBtn = document.createElement('button');
      submitBtn.className = 'btn btn-submit';
      submitBtn.textContent = 'Submit My Answer! ✨';
      submitBtn.addEventListener('click', () => {
        if (window.soundManager) window.soundManager.playSubmit();
        this._handleSubmit(quest, inputRefs, container);
      });
      actions.appendChild(submitBtn);

      // Hint button
      const hintBtn = document.createElement('button');
      hintBtn.className = 'btn btn-hint';
      hintBtn.textContent = 'Hint ⭐';
      hintBtn.addEventListener('click', () => {
        if (window.soundManager) window.soundManager.playHint();
        this._showHint(quest, inputRefs);
      });
      actions.appendChild(hintBtn);
    } else {
      // Fixed sentence - just a continue button
      const continueBtn = document.createElement('button');
      continueBtn.className = 'btn btn-submit';
      continueBtn.textContent = 'I Read It! Next! ✨';
      continueBtn.addEventListener('click', () => {
        const result = { overallTier: 'perfect', perBlank: [], feedbackMessage: this._getRandomFeedback('perfect') };
        this._triggerReward(quest, result, []);
      });
      actions.appendChild(continueBtn);
    }

    container.appendChild(actions);

    // Focus first input
    if (inputRefs.length > 0) {
      setTimeout(() => inputRefs[0].focus(), 100);
    }

    // Allow Enter key to submit
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const submitBtn = container.querySelector('.btn-submit');
        if (submitBtn) submitBtn.click();
      }
    });
  }

  /** Render a template sentence with input fields replacing blanks */
  _renderTemplateWithInputs(sentence, inputRefs) {
    // Split displayText by ____ to create segments
    const parts = sentence.displayText.split('____');
    let html = '';

    for (let i = 0; i < parts.length; i++) {
      html += `<span class="sentence-text">${parts[i]}</span>`;
      if (i < parts.length - 1) {
        const inputId = `blank-${inputRefs.length}`;
        const expectedLength = sentence.blanks[i] ? sentence.blanks[i].length : 20;
        const inputWidth = Math.max(120, Math.min(400, expectedLength * 12));
        html += `<input type="text" id="${inputId}" class="quest-input" style="width:${inputWidth}px" placeholder="type here..." autocomplete="off" spellcheck="false">`;
        // We'll collect refs after DOM insertion
        inputRefs.push(null); // placeholder
      }
    }

    // After rendering, we need to update refs - done via setTimeout in renderQuest
    setTimeout(() => {
      const inputs = document.querySelectorAll('.quest-input');
      inputs.forEach((input, i) => {
        if (i < inputRefs.length) inputRefs[i] = input;
      });
    }, 0);

    return html;
  }

  /** Handle answer submission */
  _handleSubmit(quest, inputRefs, container) {
    const templateSentence = quest.sentences.find(s => s.isTemplate);
    if (!templateSentence || !templateSentence.blanks) return;

    const userInputs = inputRefs.map(input => input ? input.value : '');
    const result = this.gradeQuest(quest, userInputs);

    if (result.overallTier === 'perfect') {
      // Immediate reward
      this._triggerReward(quest, result, userInputs);
    } else if (result.overallTier === 'close' || result.overallTier === 'creative') {
      // Show result with parent approve option
      this._showResultWithParentOption(quest, result, userInputs, inputRefs, container);
    }
  }

  /** Show grading result with parent approve option for close/creative answers */
  _showResultWithParentOption(quest, result, userInputs, inputRefs, container) {
    // Highlight inputs for close answers
    if (result.overallTier === 'close') {
      result.perBlank.forEach((r, i) => {
        if (inputRefs[i]) {
          if (r.tier === 'perfect' || r.tier === 'creative') {
            inputRefs[i].classList.add('input-correct');
            inputRefs[i].classList.remove('input-close');
          } else {
            inputRefs[i].classList.add('input-close');
            inputRefs[i].classList.remove('input-correct');
          }
        }
      });
    } else if (result.overallTier === 'creative') {
      // Mark all inputs as correct for creative answers
      inputRefs.forEach(input => {
        if (input) {
          input.classList.add('input-correct');
          input.classList.remove('input-close');
        }
      });
    }

    // Remove any existing result area
    const existing = container.querySelector('.quest-result-area');
    if (existing) existing.remove();
    // Also remove old inline feedback
    const oldFeedback = container.querySelector('.quest-feedback');
    if (oldFeedback) oldFeedback.remove();

    // Build result area
    const resultArea = document.createElement('div');
    resultArea.className = `quest-result-area result-${result.overallTier}`;

    const message = document.createElement('p');
    message.className = 'quest-result-message';
    message.textContent = result.feedbackMessage;
    resultArea.appendChild(message);

    const buttons = document.createElement('div');
    buttons.className = 'quest-result-buttons';

    // "Try Again" button (for both close and creative)
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.className = 'btn btn-hint';
    tryAgainBtn.textContent = 'Try Again ✏️';
    tryAgainBtn.addEventListener('click', () => {
      resultArea.remove();
      // Clear input highlights
      inputRefs.forEach(input => {
        if (input) {
          input.classList.remove('input-correct', 'input-close');
        }
      });
      if (inputRefs.length > 0 && inputRefs[0]) inputRefs[0].focus();
    });
    buttons.appendChild(tryAgainBtn);

    // For creative answers, show "Accept with silver star" button
    if (result.overallTier === 'creative') {
      const acceptCreativeBtn = document.createElement('button');
      acceptCreativeBtn.className = 'btn btn-submit';
      acceptCreativeBtn.textContent = 'Accept with 🌟';
      acceptCreativeBtn.addEventListener('click', () => {
        resultArea.remove();
        this._triggerReward(quest, result, userInputs);
      });
      buttons.appendChild(acceptCreativeBtn);
    }

    // "Parent: Accept Answer" button (upgrades to perfect/gold star)
    const parentBtn = document.createElement('button');
    parentBtn.className = 'btn btn-parent-approve';
    parentBtn.textContent = 'Parent: Accept \u2713';
    parentBtn.addEventListener('click', () => {
      resultArea.remove();
      // Force tier to perfect for gold star reward
      const perfectResult = Object.assign({}, result, {
        overallTier: 'perfect',
        feedbackMessage: this._getRandomFeedback('perfect')
      });
      this._triggerReward(quest, perfectResult, userInputs);
    });
    buttons.appendChild(parentBtn);

    resultArea.appendChild(buttons);

    // Insert before the quest-actions area
    const actionsEl = container.querySelector('.quest-actions');
    if (actionsEl) {
      actionsEl.before(resultArea);
    } else {
      container.appendChild(resultArea);
    }
  }

  /** Grade all blanks in a quest */
  gradeQuest(quest, userInputs) {
    const templateSentence = quest.sentences.find(s => s.isTemplate);
    if (!templateSentence || !templateSentence.blanks) {
      return { overallTier: 'perfect', perBlank: [], feedbackMessage: this._getRandomFeedback('perfect') };
    }

    const perBlank = templateSentence.blanks.map((expected, i) => {
      const userInput = userInputs[i] || '';
      return QuestEngine.gradeAnswer(userInput, expected);
    });

    // Overall tier: use the worst result
    let overallTier = 'perfect';
    for (const r of perBlank) {
      if (r.tier === 'empty') { overallTier = 'close'; break; }
      if (r.tier === 'close') { overallTier = 'close'; }
      if (r.tier === 'creative' && overallTier === 'perfect') { overallTier = 'creative'; }
    }

    // If all are empty, keep as 'close' (need to try)
    const allEmpty = perBlank.every(r => r.tier === 'empty');
    if (allEmpty) overallTier = 'close';

    return {
      overallTier,
      perBlank,
      feedbackMessage: this._getRandomFeedback(overallTier)
    };
  }

  /** Grade a single answer against expected */
  static gradeAnswer(userInput, expectedAnswer) {
    const normalize = (s) => s.trim().toLowerCase()
      .replace(/[.,!?;:'"]/g, '')
      .replace(/\s+/g, ' ');

    const user = normalize(userInput);
    const expected = normalize(expectedAnswer);

    // Empty check
    if (user.length < 2) {
      return { tier: 'empty', score: 0 };
    }

    // Tier 1: Perfect match
    if (user === expected) {
      return { tier: 'perfect', score: 3 };
    }

    // Tier 2: Close match via Levenshtein
    const distance = QuestEngine.levenshtein(user, expected);
    const threshold = Math.max(2, Math.floor(expected.length * 0.2));
    if (distance <= threshold) {
      return { tier: 'close', score: 2, distance };
    }

    // Tier 2b: Keyword match
    const expectedWords = expected.split(' ').filter(w => w.length > 2);
    if (expectedWords.length > 0) {
      const matchedWords = expectedWords.filter(w => user.includes(w));
      const keywordRatio = matchedWords.length / expectedWords.length;
      if (keywordRatio >= 0.6) {
        return { tier: 'perfect', score: 3, keywordMatch: true };
      }
      if (keywordRatio >= 0.4) {
        return { tier: 'close', score: 2, keywordRatio };
      }
    }

    // Tier 3: Creative answer (any non-trivial input)
    if (user.length >= 3) {
      return { tier: 'creative', score: 1 };
    }

    return { tier: 'empty', score: 0 };
  }

  /** Levenshtein distance */
  static levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /** Show inline feedback for "close" answers */
  _showFeedbackInline(container, result) {
    // Remove existing feedback
    const existing = container.querySelector('.quest-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = 'quest-feedback quest-feedback--close';
    feedback.textContent = result.feedbackMessage;
    container.querySelector('.quest-actions').before(feedback);

    // Auto-remove after 3 seconds
    setTimeout(() => feedback.classList.add('fade-out'), 2500);
    setTimeout(() => feedback.remove(), 3000);
  }

  /** Show hint - reveal first letter of each blank */
  _showHint(quest, inputRefs) {
    const templateSentence = quest.sentences.find(s => s.isTemplate);
    if (!templateSentence || !templateSentence.blanks) return;

    templateSentence.blanks.forEach((answer, i) => {
      if (inputRefs[i] && !inputRefs[i].value) {
        const hint = answer.substring(0, Math.ceil(answer.length * 0.3)) + '...';
        inputRefs[i].placeholder = hint;
        inputRefs[i].classList.add('hint-shown');
      }
    });
  }

  /** Get random feedback message for a tier */
  _getRandomFeedback(tier) {
    const messages = this.feedbackMessages[tier] || this.feedbackMessages.creative;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  /** Trigger reward - called by app.js callback */
  _triggerReward(quest, result, userInputs) {
    // Save progress
    const rewardResult = this.progress.markQuestComplete(
      quest.id,
      result.overallTier,
      userInputs,
      quest.sectionId
    );

    // Dispatch custom event for app.js to handle
    const event = new CustomEvent('questComplete', {
      detail: {
        quest,
        result,
        userInputs,
        reward: rewardResult
      }
    });
    document.dispatchEvent(event);
  }
}
