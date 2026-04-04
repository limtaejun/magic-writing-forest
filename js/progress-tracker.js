/**
 * progress-tracker.js
 * Manages quest progress via LocalStorage + Firestore cloud sync.
 */

class ProgressTracker {
  constructor(storageKey = 'yuna_magic_forest_progress') {
    this.storageKey = storageKey;
    this.state = null;
    this._saveTimeout = null;

    // Flush pending Firestore save before page unload
    window.addEventListener('beforeunload', () => {
      this._flushPendingSave();
    });
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

  /** Load state: Firestore first, then LocalStorage fallback */
  async load() {
    // Try Firestore if user is logged in
    if (window._db && window._currentUser) {
      try {
        const doc = await window._db
          .collection('users')
          .doc(window._currentUser.uid)
          .get();

        if (doc.exists) {
          this.state = doc.data();
          // Also cache to LocalStorage
          this._saveLocal();
          console.log('Progress loaded from Firestore');
          return this.state;
        }
      } catch (e) {
        console.warn('Firestore load failed, falling back to LocalStorage:', e);
      }
    }

    // Fallback: LocalStorage
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

    // If loaded from LocalStorage and user is logged in, push to Firestore
    if (window._db && window._currentUser && this.state.totalStamps > 0) {
      this._saveFirestore();
    }

    return this.state;
  }

  /** Save state to LocalStorage + Firestore */
  save() {
    this._saveLocal();
    this._debouncedFirestoreSave();
  }

  /** Save to LocalStorage */
  _saveLocal() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save to LocalStorage:', e);
    }
  }

  /** Debounced Firestore save (avoids too many writes) */
  _debouncedFirestoreSave() {
    if (this._saveTimeout) clearTimeout(this._saveTimeout);
    this._saveTimeout = setTimeout(() => this._saveFirestore(), 1000);
  }

  /** Save to Firestore */
  _saveFirestore() {
    if (!window._db || !window._currentUser) return;

    try {
      window._db
        .collection('users')
        .doc(window._currentUser.uid)
        .set(this.state, { merge: true })
        .then(() => console.log('Progress saved to Firestore'))
        .catch(e => {
          console.warn('Firestore save failed:', e);
          this._notifySaveError();
        });
    } catch (e) {
      console.warn('Firestore save error:', e);
      this._notifySaveError();
    }
  }

  /** Immediately execute any pending Firestore save */
  _flushPendingSave() {
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = null;
      this._saveFirestore();
    }
  }

  /** Force immediate save and return a promise (for logout) */
  async flushAndSave() {
    if (!this.state) return;
    this._saveLocal();
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout);
      this._saveTimeout = null;
    }
    if (window._db && window._currentUser) {
      try {
        await window._db
          .collection('users')
          .doc(window._currentUser.uid)
          .set(this.state, { merge: true });
        console.log('Progress saved to Firestore (flush)');
      } catch (e) {
        console.warn('Firestore flush save failed:', e);
      }
    }
  }

  /** Show on-screen notification when Firestore save fails */
  _notifySaveError() {
    let toast = document.getElementById('save-error-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'save-error-toast';
      toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#FF6B8A;color:white;padding:12px 20px;border-radius:12px;font-family:Nunito,sans-serif;font-size:0.9rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.15);transition:opacity 0.3s;';
      document.body.appendChild(toast);
    }
    toast.textContent = 'Cloud save failed. Progress saved locally only.';
    toast.style.opacity = '1';
    clearTimeout(this._toastTimeout);
    this._toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 4000);
  }

  /** Mark a quest as completed */
  markQuestComplete(questId, tier, userAnswers, sectionId) {
    if (!this.state) {
      console.error('Progress state not loaded. Call await load() first.');
      return { newStamps: 0, leveledUp: false, newLevel: 1, newLevelName: 'Matisse Beginner' };
    }

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
    if (!this.state) return null;
    return this.state.quests[String(questId)] || null;
  }

  /** Get progress for a section */
  getSectionProgress(sectionId, totalInSection) {
    if (!this.state) return { completed: 0, total: totalInSection || 0, percentage: 0 };

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
    if (!this.state) return { completed: 0, total: totalQuests, percentage: 0, stamps: { gold: 0, silver: 0 }, totalStamps: 0, level: 1, levelName: 'Matisse Beginner' };

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
    if (!this.state) return { level: 1, name: 'Matisse Beginner', totalStamps: 0, nextThreshold: 25, nextName: 'Matisse Explorer', stampsToNext: 25 };
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
