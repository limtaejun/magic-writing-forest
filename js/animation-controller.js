/**
 * animation-controller.js
 * Handles confetti, typewriter effects, character images, and sparkles.
 */

const AnimationController = (() => {

  // ═══════════════════════════════════════════
  // CONFETTI SYSTEM (Pure JS, no dependencies)
  // ═══════════════════════════════════════════

  const CONFETTI_COLORS = ['#FFB6D9', '#C8A2FF', '#A8E6CF', '#87CEEB', '#FFD700', '#FFDAB9', '#FFF9C4'];

  let confettiCanvas = null;
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimFrame = null;

  function _initConfettiCanvas() {
    if (confettiCanvas) return;
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    confettiCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
    document.body.appendChild(confettiCanvas);
    confettiCtx = confettiCanvas.getContext('2d');
    _resizeConfetti();
    window.addEventListener('resize', _resizeConfetti);
  }

  function _resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function _createConfettiParticle(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 5;
    return {
      x: x || confettiCanvas.width * (0.3 + Math.random() * 0.4),
      y: y || -10,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -speed * 1.5 + Math.random() * 2,
      w: 6 + Math.random() * 6,
      h: 4 + Math.random() * 4,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.12 + Math.random() * 0.08,
      opacity: 1,
      decay: 0.003 + Math.random() * 0.003,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    };
  }

  function _animateConfetti() {
    if (!confettiCtx || confettiParticles.length === 0) {
      if (confettiCanvas) confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimFrame = null;
      return;
    }

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confettiParticles = confettiParticles.filter(p => {
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.opacity -= p.decay;
      p.vx *= 0.99;

      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) return false;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = p.opacity;
      confettiCtx.fillStyle = p.color;

      if (p.shape === 'rect') {
        confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }

      confettiCtx.restore();
      return true;
    });

    confettiAnimFrame = requestAnimationFrame(_animateConfetti);
  }

  /** Fire confetti burst */
  function fireConfetti(options = {}) {
    _initConfettiCanvas();

    const count = options.count || 80;
    const x = options.x || confettiCanvas.width / 2;
    const y = options.y || confettiCanvas.height * 0.3;

    for (let i = 0; i < count; i++) {
      confettiParticles.push(_createConfettiParticle(x, y));
    }

    if (!confettiAnimFrame) {
      confettiAnimFrame = requestAnimationFrame(_animateConfetti);
    }
  }

  /** Fire gold confetti (perfect answer) */
  function firePerfectConfetti() {
    _initConfettiCanvas();
    // Multi-burst effect
    fireConfetti({ count: 60, y: confettiCanvas.height * 0.2 });
    setTimeout(() => fireConfetti({ count: 40, x: confettiCanvas.width * 0.2, y: confettiCanvas.height * 0.3 }), 200);
    setTimeout(() => fireConfetti({ count: 40, x: confettiCanvas.width * 0.8, y: confettiCanvas.height * 0.3 }), 400);
  }

  /** Fire subtle sparkle (creative answer) */
  function fireCreativeSparkle() {
    fireConfetti({ count: 30 });
  }

  // ═══════════════════════════════════════════
  // TYPEWRITER EFFECT
  // ═══════════════════════════════════════════

  /**
   * Apply typewriter effect to sentence elements.
   * @param {HTMLElement} scrollContainer - The .quest-scroll container
   * @param {Function} onComplete - Called when all sentences are revealed
   */
  function typewriterSentences(scrollContainer, onComplete) {
    const sentences = scrollContainer.querySelectorAll('.quest-sentence');
    const templateSentence = scrollContainer.querySelector('.quest-sentence--template');

    sentences.forEach(s => {
      s.style.opacity = '0';
      s.style.transform = 'translateY(12px)';
    });

    let delay = 200;
    sentences.forEach((sentenceEl, idx) => {
      const isTemplate = sentenceEl.classList.contains('quest-sentence--template');

      setTimeout(() => {
        sentenceEl.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        sentenceEl.style.opacity = '1';
        sentenceEl.style.transform = 'translateY(0)';

        // For non-template sentences, add text reveal effect
        if (!isTemplate) {
          const textSpan = sentenceEl.querySelector('.sentence-text');
          if (textSpan) {
            const fullText = textSpan.textContent;
            textSpan.textContent = '';
            _typeText(textSpan, fullText, 18);
          }
        }

        // When template sentence appears, focus input
        if (isTemplate) {
          setTimeout(() => {
            const input = sentenceEl.querySelector('.quest-input');
            if (input) input.focus();
            if (onComplete) onComplete();
          }, 300);
        }
      }, delay);

      delay += isTemplate ? 600 : 500 + Math.min(sentenceEl.textContent.length * 2, 400);
    });
  }

  /** Type text character by character */
  function _typeText(element, text, speed) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  }

  // ═══════════════════════════════════════════
  // CHARACTER IMAGE SYSTEM
  // ═══════════════════════════════════════════

  // Map of character keywords to image paths
  const CHARACTER_MAP = {
    // Yuna states
    'default':  { path: 'assets/images/characters/yuna/yuna-default.png', emoji: '🧙‍♀️' },
    'writing':  { path: 'assets/images/characters/yuna/yuna-writing.png', emoji: '✏️' },
    'happy':    { path: 'assets/images/characters/yuna/yuna-happy.png', emoji: '🎉' },
    'thinking': { path: 'assets/images/characters/yuna/yuna-thinking.png', emoji: '🤔' },
    'victory':  { path: 'assets/images/characters/yuna/yuna-victory.png', emoji: '🏆' },
    'surprised':{ path: 'assets/images/characters/yuna/yuna-surprised.png', emoji: '😲' },
    'reading':  { path: 'assets/images/characters/yuna/yuna-reading.png', emoji: '📖' },
    'wizard':   { path: 'assets/images/characters/yuna/yuna-wizard.png', emoji: '🧙‍♀️' },
    // Ponies
    'sparkle-wing':  { path: 'assets/images/characters/ponies/sparkle-wing.png', emoji: '🦄' },
    'party-bloom':   { path: 'assets/images/characters/ponies/party-bloom.png', emoji: '🎈' },
    'sky-dash':      { path: 'assets/images/characters/ponies/sky-dash.png', emoji: '🌈' },
    'heart-flutter': { path: 'assets/images/characters/ponies/heart-flutter.png', emoji: '🦋' },
    // Fairy
    'hearting':      { path: 'assets/images/characters/teeniepings/hearting.png', emoji: '💖' },
    'twinkle-ping':  { path: 'assets/images/characters/teeniepings/twinkle-ping.png', emoji: '✨' },
    // Cats
    'cat-calico':    { path: 'assets/images/characters/cats/cat-calico.png', emoji: '🐱' },
  };

  // Cache of which images actually exist
  const _imageCache = {};

  /** Check if an image file exists (async) */
  function _imageExists(path) {
    if (path in _imageCache) return Promise.resolve(_imageCache[path]);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => { _imageCache[path] = true; resolve(true); };
      img.onerror = () => { _imageCache[path] = false; resolve(false); };
      img.src = path;
    });
  }

  /**
   * Create a character display element.
   * Shows the image if it exists, otherwise shows emoji fallback.
   * @param {string} characterKey - Key from CHARACTER_MAP
   * @returns {HTMLElement}
   */
  function createCharacterDisplay(characterKey) {
    const char = CHARACTER_MAP[characterKey] || CHARACTER_MAP['default'];
    const container = document.createElement('div');
    container.className = 'character-display';
    container.innerHTML = `<span class="character-emoji">${char.emoji}</span>`;

    // Try to load the image
    _imageExists(char.path).then(exists => {
      if (exists) {
        container.innerHTML = `<img src="${char.path}" alt="${characterKey}" class="character-img">`;
      }
    });

    return container;
  }

  /** Pick a random reward character based on quest content */
  function pickRewardCharacter(quest) {
    const text = quest.sentences.map(s => s.text || '').join(' ').toLowerCase();

    if (text.includes('pony') || text.includes('equestria') || text.includes('twilight') || text.includes('rainbow'))
      return ['sparkle-wing', 'party-bloom', 'sky-dash'][Math.floor(Math.random() * 3)];
    if (text.includes('teenieping') || text.includes('hatchuping') || text.includes('fairy'))
      return ['hearting', 'twinkle-ping'][Math.floor(Math.random() * 2)];
    if (text.includes('cat') || text.includes('kitten'))
      return 'cat-calico';

    // Default: random Yuna states
    return ['happy', 'victory', 'wizard'][Math.floor(Math.random() * 3)];
  }

  // ═══════════════════════════════════════════
  // SPARKLE / PARTICLE EFFECTS
  // ═══════════════════════════════════════════

  /** Add floating sparkle particles to an element */
  function addSparkles(element, count = 8) {
    const container = document.createElement('div');
    container.className = 'sparkle-container';
    container.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle-particle';
      sparkle.textContent = ['✦', '✧', '⋆', '✨'][Math.floor(Math.random() * 4)];
      sparkle.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 3}s;
        animation-duration: ${2 + Math.random() * 2}s;
        font-size: ${8 + Math.random() * 10}px;
      `;
      container.appendChild(sparkle);
    }

    element.style.position = 'relative';
    element.appendChild(container);
  }

  // ═══════════════════════════════════════════
  // STAMP BOUNCE ANIMATION
  // ═══════════════════════════════════════════

  /** Animate a stamp appearing with bounce */
  function stampBounce(element) {
    element.style.animation = 'none';
    void element.offsetHeight; // trigger reflow
    element.style.animation = 'stampBounce 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
  }

  // ═══════════════════════════════════════════
  // LEVEL UP EFFECT
  // ═══════════════════════════════════════════

  /** Full-screen golden flash for level up */
  function levelUpEffect() {
    const overlay = document.createElement('div');
    overlay.className = 'levelup-overlay';
    overlay.innerHTML = '<div class="levelup-flash"></div>';
    document.body.appendChild(overlay);

    firePerfectConfetti();

    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => overlay.remove(), 500);
    }, 1500);
  }

  // ═══════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════

  return {
    fireConfetti,
    firePerfectConfetti,
    fireCreativeSparkle,
    typewriterSentences,
    createCharacterDisplay,
    pickRewardCharacter,
    addSparkles,
    stampBounce,
    levelUpEffect,
    CHARACTER_MAP
  };

})();
