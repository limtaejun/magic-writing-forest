/**
 * build-quests.js
 * Node.js script to convert MD templates into quests.json
 * Usage: node build-quests.js
 */

const fs = require('fs');
const path = require('path');
const MdParser = require('./js/md-parser.js');

const TEMPLATES_PATH = path.join(__dirname, 'templates', 'templates.md');
const TEMPLATES_5S_PATH = path.join(__dirname, 'templates', 'templates_5sentences.md');
const OUTPUT_PATH = path.join(__dirname, 'data', 'quests.json');

console.log('🦄 Building Yuna\'s Magic Quest Data...\n');

// Read source files
const templatesMd = fs.readFileSync(TEMPLATES_PATH, 'utf-8');
const templates5Md = fs.readFileSync(TEMPLATES_5S_PATH, 'utf-8');

console.log(`📄 templates.md: ${templatesMd.split('\n').length} lines`);
console.log(`📄 templates_5sentences.md: ${templates5Md.split('\n').length} lines`);

// Parse
const questData = MdParser.parse(templatesMd, templates5Md);

// Stats
let totalQuests = 0;
for (const section of questData.sections) {
  console.log(`  ${section.emoji} ${section.nameEn}: ${section.quests.length} quests`);
  totalQuests += section.quests.length;
}
console.log(`\n✨ Total: ${totalQuests} quests in ${questData.sections.length} sections`);

// Validate: check for quests with missing sentences
let warnings = 0;
for (const section of questData.sections) {
  for (const quest of section.quests) {
    if (quest.sentences.length < 4) {
      console.warn(`  ⚠️  Quest ${quest.id}: only ${quest.sentences.length} sentences parsed`);
      warnings++;
    }
    if (quest.type === 'fill-in') {
      const tmpl = quest.sentences.find(s => s.isTemplate);
      if (!tmpl || !tmpl.blanks || tmpl.blanks.length === 0) {
        console.warn(`  ⚠️  Quest ${quest.id}: marked fill-in but no blanks found`);
        warnings++;
      }
    }
  }
}

if (warnings > 0) {
  console.log(`\n⚠️  ${warnings} warnings found. Check quest data manually.`);
}

// Write output
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(questData, null, 2), 'utf-8');
console.log(`\n💾 Saved to ${OUTPUT_PATH}`);

// Also generate a JS embeddable version for file:// usage
const jsOutput = `// Auto-generated quest data - do not edit manually\nwindow.QUEST_DATA = ${JSON.stringify(questData)};\n`;
const JS_OUTPUT_PATH = path.join(__dirname, 'data', 'quests-data.js');
fs.writeFileSync(JS_OUTPUT_PATH, jsOutput, 'utf-8');
console.log(`💾 Saved embeddable JS to ${JS_OUTPUT_PATH}`);

console.log('\n🎉 Build complete!');
