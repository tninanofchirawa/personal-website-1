/**
 * Role: Theme, Color Palettes & Emojis
 * Role 1: Deterministic string hashing and gradient palette selection.
 * Role 2: Curated track emoji mapping.
 */
(function (window) {
  'use strict';

  const GRADIENTS = [
    { name: 'blue', fill: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)', badge: 'bg-primary-subtle text-primary border-primary-subtle', icon: 'bg-primary-subtle text-primary' },
    { name: 'amber', fill: 'linear-gradient(90deg, #f59e0b 0%, #d97706 50%, #b45309 100%)', badge: 'bg-warning-subtle text-warning-emphasis border-warning-subtle', icon: 'bg-warning-subtle text-warning-emphasis' },
    { name: 'emerald', fill: 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)', badge: 'bg-success-subtle text-success-emphasis border-success-subtle', icon: 'bg-success-subtle text-success-emphasis' },
    { name: 'purple', fill: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)', badge: 'bg-info-subtle text-info-emphasis border-info-subtle', icon: 'bg-info-subtle text-info-emphasis' },
    { name: 'red', fill: 'linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', badge: 'bg-danger-subtle text-danger border-danger-subtle', icon: 'bg-danger-subtle text-danger' },
    { name: 'cyan', fill: 'linear-gradient(90deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)', badge: 'bg-info-subtle text-info-emphasis border-info-subtle', icon: 'bg-info-subtle text-info-emphasis' }
  ];

  const CURATED_EMOJIS = {
    // Data Science Tracks
    '01-numpy-100': '⚡',
    '02-pandas-exercises': '🐼',
    '03-pandas-puzzles-100': '🧩',

    // CSES Problem Set Topics
    '01-Introductory-Problems': '🚀',
    '02-Sorting-and-Searching': '🔍',
    '03-Dynamic-Programming': '🧩',
    '04-Graph-Algorithms': '🕸️',
    '05-Range-Queries': '🎯',
    '06-Tree-Algorithms': '🌲',
    '07-Mathematics': '🧮',
    '08-String-Algorithms': '📜',
    '09-Geometry': '📐',
    '10-Advanced-Techniques': '🧠',
    '11-Additional-Problems': '🏆'
  };

  const EMOJIS = ['⚡', '📊', '🧩', '💻', '🚀', '🧠', '🔬', '🔥', '🎯', '🌲', '🪐', '📚', '🛠️', '💡', '🏆', '📈', '🧮', '🎲'];

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function getPalette(name) {
    const idx = hashString(name || 'default') % GRADIENTS.length;
    return GRADIENTS[idx];
  }

  function getEmoji(name) {
    if (!name) return '📁';
    if (CURATED_EMOJIS[name]) return CURATED_EMOJIS[name];

    // Check without numeric prefix (e.g. "introductory-problems")
    const cleanKey = name.replace(/^[0-9]+[-_]/, '').toLowerCase();
    for (const [k, v] of Object.entries(CURATED_EMOJIS)) {
      if (k.replace(/^[0-9]+[-_]/, '').toLowerCase() === cleanKey) {
        return v;
      }
    }

    const idx = hashString(name || 'default') % EMOJIS.length;
    return EMOJIS[idx];
  }

  window.AppTheme = {
    getPalette,
    getEmoji
  };
})(window);
