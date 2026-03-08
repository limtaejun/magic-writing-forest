/**
 * progress-tracker.js
 * Manages quest progress, stamps, badges, and levels via LocalStorage.
 */

class ProgressTracker {
  constructor(storageKey = 'yuna_magic_forest_progress') {
    this.storageKey = storageKey;
    this.state = null;
  }

  /** Default empty state */
  static defaultState() {
    return {
      version: 1,
      playerName: 'Yuna',
      level: 1,
      levelName: 'Matisse Beginner',
      totalStamps: 0,
      quests: {},
      sections: {},
      stamps: { gold: 0, silver: 0 },
      badges: [],
      lastPlayedAt: null
    };
  }

  /** Level thresholds */
  static get LEVELS() {
    return [
      { level: 1, name: 'Matisse Beginner', threshold: 0 },
      { level: 2, name: 'Matisse Explorer', threshold: 25 },
      { level: 3, name: 'Lincoln Learner', threshold: 75 },
      { level: 4, name: 'Lincoln Writer', threshold: 150 },
      { level: 5, name: 'Lincoln Master', threshold: 200 }
    ];
  }

  /** Load state from LocalStorage */
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        this.state = JSON.parse(raw);
      } else {
        this.state = ProgressTracker.defaultState();
      }
    } catch (e) {
      console.warn('Failed to load progress, starting fresh:', e);
      this.state = ProgressTracker.defaultState();
    }
    return this.state;
  }

  /** Save state to LocalStorage */
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  }

  /** Mark a quest as completed */
  markQuestComplete(questId, tier, userAnswers, sectionId) {
    if (!this.state) this.load();

    const questKey = String(questId);
    const existing = this.state.quests[questKey];
    const isNewCompletion = !existing || !existing.completed;

    this.state.quests[questKey] = {
      completed: true,
      tier,
      attempts: (existing ? existing.attempts : 0) + 1,
      completedAt: new Date().toISOString(),
      userAnswer: userAnswers,
      sectionId
    };

    // Update stamps only for new completions
    let newStamps = 0;
    if (isNewCompletion) {
      if (tier === 'perfect') {
        this.state.stamps.gold++;
        newStamps = 1;
      } else if (tier === 'creative' || tier === 'close') {
        this.state.stamps.silver++;
        newStamps = 1;
      }
      this.state.totalStamps = this.state.stamps.gold + this.state.stamps.silver;
    }

    // Update section progress
    if (sectionId) {
      this._updateSectionProgress(sectionId);
    }

    // Check level up
    const oldLevel = this.state.level;
    this._updateLevel();
    const leveledUp = this.state.level > oldLevel;

    this.state.lastPlayedAt = new Date().toISOString();
    this.save();

    return { newStamps, leveledUp, newLevel: this.state.level, newLevelName: this.state.levelName };
  }

  /** Get status of a specific quest */
  getQuestStatus(questId) {
    if (!this.state) this.load();
    return this.state.quests[String(questId)] || null;
  }

  /** Get progress for a section */
  getSectionProgress(sectionId, totalInSection) {
    if (!this.state) this.load();

    let completed = 0;
    for (const [, q] of Object.entries(this.state.quests)) {
      if (q.sectionId === sectionId && q.completed) {
        completed++;
      }
    }

    return {
      completed,
      total: totalInSection || 0,
      percentage: totalInSection ? Math.round((completed / totalInSection) * 100) : 0
    };
  }

  /** Get overall progress */
  getTotalProgress(totalQuests = 235) {
    if (!this.state) this.load();

    let completed = 0;
    for (const q of Object.values(this.state.quests)) {
      if (q.completed) completed++;
    }

    return {
      completed,
      total: totalQuests,
      percentage: Math.round((completed / totalQuests) * 100),
      stamps: { ...this.state.stamps },
      totalStamps: this.state.totalStamps,
      level: this.state.level,
      levelName: this.state.levelName
    };
  }

  /** Calculate and update level based on total stamps */
  _updateLevel() {
    const stamps = this.state.totalStamps;
    const levels = ProgressTracker.LEVELS;

    for (let i = levels.length - 1; i >= 0; i--) {
      if (stamps >= levels[i].threshold) {
        this.state.level = levels[i].level;
        this.state.levelName = levels[i].name;
        return;
      }
    }
  }

  /** Update section progress cache */
  _updateSectionProgress(sectionId) {
    // Section progress is computed on-the-fly from quests, no cache needed
  }

  /** Get level info */
  getLevelInfo() {
    if (!this.state) this.load();
    const levels = ProgressTracker.LEVELS;
    const currentIdx = levels.findIndex(l => l.level === this.state.level);
    const next = levels[currentIdx + 1] || null;

    return {
      level: this.state.level,
      name: this.state.levelName,
      totalStamps: this.state.totalStamps,
      nextThreshold: next ? next.threshold : null,
      nextName: next ? next.name : null,
      stampsToNext: next ? next.threshold - this.state.totalStamps : 0
    };
  }

  /** Reset all progress */
  reset() {
    this.state = ProgressTracker.defaultState();
    this.save();
  }
}
