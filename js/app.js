/**
 * app.js
 * Main application controller for Yuna's Magic Writing Forest
 */

class App {
  constructor() {
    this.questData = null;
    this.progress = new ProgressTracker();
    this.engine = null;
    this.currentScreen = 'map';
    this.currentSectionId = null;
  }

  /** Initialize the app */
  async init() {
    // Load progress
    this.progress.load();

    // Load quest data
    await this.loadQuestData();

    // Initialize engine
    this.engine = new QuestEngine(this.questData, this.progress);

    // Listen for quest complete events
    document.addEventListener('questComplete', (e) => this.onQuestComplete(e.detail));

    // Bind navigation
    this.bindEvents();

    // Show map
    this.showScreen('map');

    // Update profile
    this.updateProfile();

    console.log('🦄 Yuna\'s Magic Writing Forest is ready!');
  }

  /** Load quest data from embedded MD or pre-built JSON */
  async loadQuestData() {
    // Option 1: Pre-built JSON data
    if (window.QUEST_DATA) {
      this.questData = window.QUEST_DATA;
      return;
    }

    // Option 2: Parse embedded MD at runtime (works with file://)
    if (window._QUEST_MD && typeof MdParser !== 'undefined') {
      try {
        this.questData = MdParser.parse(window._QUEST_MD.templates, window._QUEST_MD.five);
        console.log(`Parsed ${this.questData.totalQuests} quests from ${this.questData.sections.length} sections`);
        return;
      } catch (e) {
        console.error('MD parsing failed:', e);
      }
    }

    // Option 3: Fetch JSON (Live Server only)
    try {
      const response = await fetch('data/quests.json');
      this.questData = await response.json();
    } catch (e) {
      console.error('Failed to load quest data:', e);
      document.getElementById('app').innerHTML = `
        <div style="text-align:center; padding:40px; font-family:sans-serif;">
          <h2>Quest data not found!</h2>
          <p>Check that <code>data/quests-data.js</code> is present.</p>
        </div>
      `;
    }
  }

  /** Bind UI events */
  bindEvents() {
    // Map location clicks
    document.querySelectorAll('.map-location').forEach(el => {
      el.addEventListener('click', () => {
        if (window.soundManager) window.soundManager.playNavigate();
        const target = el.dataset.target;
        switch (target) {
          case 'aca':
            this.showScreen('sections');
            break;
          case 'pangyo':
            this.showScreen('collection');
            break;
          case 'jeju':
            this.showScreen('location-quests', { location: 'jeju' });
            break;
          case 'ponyville':
            this.showScreen('location-quests', { location: 'ponyville' });
            break;
        }
      });
    });

    // Back buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-back-map')) {
        if (window.soundManager) window.soundManager.playBack();
        this.showScreen('map');
      }
      if (e.target.closest('.btn-back-sections')) {
        if (window.soundManager) window.soundManager.playBack();
        this.showScreen('sections');
      }
      if (e.target.closest('.btn-back-quests')) {
        if (window.soundManager) window.soundManager.playBack();
        if (this._lastQuestListScreen === 'location-quests') {
          this.showScreen('map');
        } else {
          this.showScreen('quest-list');
        }
      }
      if (e.target.closest('.btn-back-location-quests')) {
        this.showScreen('map');
      }
    });

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (window.soundManager) {
          const muted = window.soundManager.toggleMute();
          soundBtn.classList.toggle('muted', muted);
          soundBtn.textContent = muted ? '🔇' : '🔊';
          if (!muted) window.soundManager.playClick();
        }
      });
    }

    // Volume slider
    const volSlider = document.getElementById('volume-slider');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value) / 100;
        if (window.soundManager) {
          window.soundManager.setVolume(val);
          // Update mute button state
          if (soundBtn) {
            if (val === 0) {
              soundBtn.textContent = '🔇';
              soundBtn.classList.add('muted');
            } else {
              soundBtn.textContent = '🔊';
              soundBtn.classList.remove('muted');
            }
          }
        }
      });
    }
  }

  /** Switch screens */
  showScreen(screenName, data = {}) {
    this.currentScreen = screenName;

    // Switch BGM based on screen
    if (window.soundManager) {
      window.soundManager.playBGM(screenName);
    }

    // Hide all screens
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // Clear location background themes
    document.body.classList.remove('bg-jeju-list', 'bg-jeju-quest', 'bg-jeju-reward');

    switch (screenName) {
      case 'map':
        this._currentLocation = null;
        document.getElementById('screen-map').classList.add('active');
        this.updateProfile();
        break;

      case 'sections':
        document.getElementById('screen-sections').classList.add('active');
        this.renderSections();
        break;

      case 'quest-list':
        this._lastQuestListScreen = 'quest-list';
        document.getElementById('screen-quest-list').classList.add('active');
        this.renderQuestList(data.sectionId);
        break;

      case 'quest':
        document.getElementById('screen-quest').classList.add('active');
        if (this._currentLocation === 'jeju') {
          document.body.classList.add('bg-jeju-quest');
        }
        this.startQuest(data.questId);
        break;

      case 'reward':
        document.getElementById('screen-reward').classList.add('active');
        if (this._currentLocation === 'jeju') {
          document.body.classList.add('bg-jeju-reward');
        }
        break;

      case 'collection':
        document.getElementById('screen-collection').classList.add('active');
        this.renderCollection();
        break;

      case 'location-quests':
        this._lastQuestListScreen = 'location-quests';
        this._currentLocation = data.location || null;
        document.getElementById('screen-location-quests').classList.add('active');
        if (data.location === 'jeju') {
          document.body.classList.add('bg-jeju-list');
        }
        this.renderLocationQuests(data.location);
        break;
    }
  }

  /** Render section cards */
  renderSections() {
    const container = document.getElementById('sections-grid');
    container.innerHTML = '';

    for (const section of this.engine.getSections()) {
      const progress = this.progress.getSectionProgress(section.id, section.quests.length);

      const card = document.createElement('div');
      card.className = 'section-card';
      if (progress.percentage === 100) card.classList.add('section-complete');
      card.innerHTML = `
        <div class="section-card-emoji">${section.emoji}</div>
        <h3 class="section-card-title">${section.nameEn}</h3>
        <p class="section-card-subtitle">${section.nameKr}</p>
        <div class="section-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress.percentage}%"></div>
          </div>
          <span class="progress-text">${progress.completed}/${section.quests.length}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        if (window.soundManager) window.soundManager.playClick();
        this.currentSectionId = section.id;
        this.showScreen('quest-list', { sectionId: section.id });
      });
      container.appendChild(card);
    }
  }

  /** Render quest list for a section */
  renderQuestList(sectionId) {
    const section = this.engine.getSection(sectionId || this.currentSectionId);
    if (!section) return;

    const titleEl = document.getElementById('quest-list-title');
    if (titleEl) titleEl.textContent = `${section.emoji} ${section.nameEn}`;

    const container = document.getElementById('quest-list-grid');
    container.innerHTML = '';

    for (const quest of section.quests) {
      const status = this.progress.getQuestStatus(quest.id);
      const item = document.createElement('div');
      item.className = 'quest-list-item' + (status && status.completed ? ' quest-completed' : '');

      const stampIcon = status && status.completed
        ? (status.tier === 'perfect' ? '⭐' : '🌟')
        : '○';

      item.innerHTML = `
        <span class="quest-list-stamp">${stampIcon}</span>
        <span class="quest-list-number">Quest ${quest.id}</span>
        <span class="quest-list-pattern">${quest.templatePattern}</span>
      `;

      item.addEventListener('click', () => {
        if (window.soundManager) window.soundManager.playClick();
        this.showScreen('quest', { questId: quest.id });
      });

      container.appendChild(item);
    }
  }

  /** Start a quest */
  startQuest(questId) {
    const quest = this.engine.getQuest(questId);
    if (!quest) return;

    if (window.soundManager) window.soundManager.playQuestStart();
    const container = document.getElementById('quest-container');
    this.engine.renderQuest(quest, container);
  }

  /** Handle quest completion */
  onQuestComplete(detail) {
    const { quest, result, userInputs, reward } = detail;

    // Build reward screen
    const rewardContainer = document.getElementById('reward-content');
    const stampEmoji = result.overallTier === 'perfect' ? '⭐' : '🌟';

    // Build completed paragraph display
    const completedText = quest.sentences.map((s, i) => {
      if (s.isTemplate && s.blanks && userInputs.length > 0) {
        let text = s.displayText;
        s.blanks.forEach((blank, bi) => {
          text = text.replace('____', userInputs[bi] || '____');
        });
        return `<strong>${s.num}. ${text}</strong>`;
      }
      return `${s.num}. ${s.text}`;
    }).join('<br>');

    // Pick reward character
    const rewardCharKey = AnimationController.pickRewardCharacter(quest);
    const rewardCharData = AnimationController.CHARACTER_MAP[rewardCharKey] || AnimationController.CHARACTER_MAP['happy'];

    rewardContainer.innerHTML = `
      <div class="reward-stamp">${stampEmoji}</div>
      <div class="reward-character" id="reward-char-slot"></div>
      <h2 class="reward-message">${result.feedbackMessage}</h2>
      <div class="reward-story">
        <h3>Your Completed Story:</h3>
        <div class="completed-paragraph">${completedText}</div>
      </div>
      ${reward.leveledUp ? `<div class="reward-levelup">🎉 Level Up! You are now a ${reward.newLevelName}!</div>` : ''}
      <div class="reward-actions">
        <button class="btn btn-primary" id="btn-next-quest">Next Quest →</button>
        <button class="btn btn-secondary btn-back-map">Back to Map</button>
        <button class="btn btn-secondary" id="btn-print-story">Print My Story 🖨️</button>
      </div>
    `;

    // Insert character image
    const charSlot = document.getElementById('reward-char-slot');
    if (charSlot) {
      charSlot.appendChild(AnimationController.createCharacterDisplay(rewardCharKey));
    }

    this.showScreen('reward');
    this.updateProfile();

    // Fire confetti + sound!
    if (result.overallTier === 'perfect') {
      AnimationController.firePerfectConfetti();
      if (window.soundManager) window.soundManager.playPerfect();
    } else if (result.overallTier === 'creative') {
      AnimationController.fireCreativeSparkle();
      if (window.soundManager) window.soundManager.playCreative();
    } else {
      AnimationController.fireCreativeSparkle();
      if (window.soundManager) window.soundManager.playClose();
    }

    // Stamp sound
    if (window.soundManager) setTimeout(() => window.soundManager.playStamp(), 500);

    // Level up effect
    if (reward.leveledUp) {
      setTimeout(() => {
        AnimationController.levelUpEffect();
        if (window.soundManager) window.soundManager.playLevelUp();
      }, 800);
    }

    // Animate stamp
    const stampEl = rewardContainer.querySelector('.reward-stamp');
    if (stampEl) AnimationController.stampBounce(stampEl);

    // Bind reward buttons
    document.getElementById('btn-next-quest').addEventListener('click', () => {
      const nextQuest = this.engine.getNextUncompletedQuest(quest.sectionId);
      if (nextQuest) {
        this.showScreen('quest', { questId: nextQuest.id });
      } else {
        this.showScreen('sections');
      }
    });

    const printBtn = document.getElementById('btn-print-story');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.printStory(quest, userInputs));
    }
  }

  /** Update profile display */
  updateProfile() {
    const total = this.progress.getTotalProgress(this.questData ? this.questData.totalQuests : 235);
    const levelInfo = this.progress.getLevelInfo();

    const nameEl = document.getElementById('profile-name');
    const levelEl = document.getElementById('profile-level');
    const stampsEl = document.getElementById('profile-stamps');
    const progressEl = document.getElementById('profile-progress');

    if (nameEl) nameEl.textContent = this.progress.state.playerName;
    if (levelEl) levelEl.textContent = `Lv.${levelInfo.level} ${levelInfo.name}`;
    if (stampsEl) stampsEl.textContent = `⭐ ${total.stamps.gold}  🌟 ${total.stamps.silver}`;
    if (progressEl) progressEl.textContent = `${total.completed}/${total.total} quests`;

    // Load Yuna avatar image if available
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl && !avatarEl.querySelector('img')) {
      const img = new Image();
      img.src = 'assets/images/characters/yuna/yuna-default.png';
      img.alt = 'Yuna';
      img.className = 'profile-avatar-img';
      img.onload = () => { avatarEl.innerHTML = ''; avatarEl.appendChild(img); };
    }
  }

  /** Render collection book (Pangyo) */
  renderCollection() {
    const container = document.getElementById('collection-content');
    const total = this.progress.getTotalProgress(this.questData.totalQuests);
    const levelInfo = this.progress.getLevelInfo();

    // Level progress
    const levelProgressPct = levelInfo.nextThreshold
      ? Math.round(((total.totalStamps - (ProgressTracker.LEVELS[levelInfo.level - 1]?.threshold || 0)) /
          (levelInfo.nextThreshold - (ProgressTracker.LEVELS[levelInfo.level - 1]?.threshold || 0))) * 100)
      : 100;

    let html = `
      <div class="collection-profile">
        <div class="collection-avatar" id="collection-avatar">🧙‍♀️</div>
        <h2>${this.progress.state.playerName}</h2>
        <div class="collection-level-badge">
          <span class="level-label">Lv.${levelInfo.level}</span>
          <span class="level-name">${levelInfo.name}</span>
        </div>
        <div class="collection-level-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width:${levelProgressPct}%"></div>
          </div>
          ${levelInfo.nextName
            ? `<span class="progress-text">${levelInfo.stampsToNext} stamps to ${levelInfo.nextName}</span>`
            : `<span class="progress-text">Max level reached!</span>`
          }
        </div>
        <div class="collection-stats">
          <div class="stat-item"><span class="stat-num">${total.completed}</span><span class="stat-label">Quests Done</span></div>
          <div class="stat-item"><span class="stat-num">⭐ ${total.stamps.gold}</span><span class="stat-label">Gold Stars</span></div>
          <div class="stat-item"><span class="stat-num">🌟 ${total.stamps.silver}</span><span class="stat-label">Silver Stars</span></div>
        </div>
      </div>

      <h3 class="collection-section-title">Section Progress</h3>
      <div class="collection-sections">
    `;

    for (const section of this.engine.getSections()) {
      const progress = this.progress.getSectionProgress(section.id, section.quests.length);
      const isComplete = progress.percentage === 100;

      html += `
        <div class="collection-section-row ${isComplete ? 'complete' : ''}">
          <span class="collection-section-emoji">${section.emoji}</span>
          <span class="collection-section-name">${section.nameEn}</span>
          <div class="collection-section-bar">
            <div class="progress-bar"><div class="progress-fill" style="width:${progress.percentage}%"></div></div>
          </div>
          <span class="collection-section-count">${progress.completed}/${section.quests.length}</span>
          ${isComplete ? '<span class="collection-section-badge-done">✅</span>' : ''}
        </div>
      `;
    }

    html += '</div>';
    container.innerHTML = html;

    // Load Yuna avatar image
    const colAvatar = document.getElementById('collection-avatar');
    if (colAvatar) {
      const img = new Image();
      img.src = 'assets/images/characters/yuna/yuna-default.png';
      img.alt = 'Yuna';
      img.className = 'collection-avatar-img';
      img.onload = () => { colAvatar.innerHTML = ''; colAvatar.appendChild(img); };
    }
  }

  /** Render location-themed quests (Jeju / Ponyville) */
  renderLocationQuests(location) {
    const config = {
      jeju: {
        title: '🏝️ Jeju Memory Island',
        subtitle: 'Quests about your memories of Jeju Island',
        keywords: ['jeju', 'island', 'ocean', 'beach', 'tangerine', 'sea', 'horse', 'hareubang', 'seashell'],
        emptyMsg: 'No Jeju-themed quests found. Try ACA Magic Academy for all quests!'
      },
      ponyville: {
        title: '🌈 Ponyville Portal',
        subtitle: 'Quests about ponies, Equestria, and magical friendship',
        keywords: ['pony', 'ponies', 'ponyville', 'equestria', 'twilight', 'rainbow', 'dash', 'pinkie', 'fluttershy',
                   'rarity', 'applejack', 'cutie mark', 'mane six', 'sonic rainboom', 'unicorn', 'pegasus', 'canterlot'],
        emptyMsg: 'No pony-themed quests found!'
      }
    };

    const loc = config[location];
    if (!loc) return;

    const titleEl = document.getElementById('location-quests-title');
    const subtitleEl = document.getElementById('location-quests-subtitle');
    const container = document.getElementById('location-quests-grid');

    if (titleEl) titleEl.textContent = loc.title;
    if (subtitleEl) subtitleEl.textContent = loc.subtitle;
    container.innerHTML = '';

    // Find matching quests by scanning sentence text for keywords
    const matchingQuests = [];
    for (const section of this.questData.sections) {
      for (const quest of section.quests) {
        const allText = quest.sentences.map(s => (s.text || '').toLowerCase()).join(' ')
          + ' ' + (quest.templatePattern || '').toLowerCase()
          + ' ' + (quest.templateFull || '').toLowerCase();

        const matches = loc.keywords.some(kw => allText.includes(kw));
        if (matches) {
          matchingQuests.push({ quest, section });
        }
      }
    }

    if (matchingQuests.length === 0) {
      container.innerHTML = `<p class="empty-message">${loc.emptyMsg}</p>`;
      return;
    }

    // Render count
    const countEl = document.createElement('p');
    countEl.className = 'location-quest-count';
    countEl.textContent = `${matchingQuests.length} quests found!`;
    container.appendChild(countEl);

    for (const { quest, section } of matchingQuests) {
      const status = this.progress.getQuestStatus(quest.id);
      const item = document.createElement('div');
      item.className = 'quest-list-item' + (status && status.completed ? ' quest-completed' : '');

      const stampIcon = status && status.completed
        ? (status.tier === 'perfect' ? '⭐' : '🌟')
        : '○';

      item.innerHTML = `
        <span class="quest-list-stamp">${stampIcon}</span>
        <span class="quest-list-number">${section.emoji} Q${quest.id}</span>
        <span class="quest-list-pattern">${quest.templatePattern}</span>
      `;

      item.addEventListener('click', () => {
        this._lastQuestListScreen = 'location-quests';
        this.currentSectionId = quest.sectionId;
        this.showScreen('quest', { questId: quest.id });
      });

      container.appendChild(item);
    }
  }

  /** Print the completed story */
  printStory(quest, userInputs) {
    const printArea = document.getElementById('print-area');
    const section = this.engine.getSection(quest.sectionId);

    const storyHtml = quest.sentences.map((s, i) => {
      if (s.isTemplate && s.blanks && userInputs.length > 0) {
        let text = s.displayText;
        s.blanks.forEach((blank, bi) => {
          text = text.replace('____', userInputs[bi] || '____');
        });
        return `<p class="print-sentence print-sentence--answer"><strong>${s.num}. ${text}</strong></p>`;
      }
      return `<p class="print-sentence">${s.num}. ${s.text}</p>`;
    }).join('\n');

    printArea.innerHTML = `
      <div class="print-story">
        <h1 class="print-title">🦄 Yuna's Magic Story</h1>
        <h2 class="print-subtitle">${section ? section.emoji + ' ' + section.nameEn : ''} - Quest ${quest.id}</h2>
        <div class="print-body">${storyHtml}</div>
        <div class="print-footer">
          <p>Written by Yuna ✨ ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;

    window.print();
  }
}

// Boot
(function bootApp() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const app = new App();
      app.init();
    });
  } else {
    const app = new App();
    app.init();
  }
})();
