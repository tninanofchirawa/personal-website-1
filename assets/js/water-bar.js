/**
 * Role: Water Progress Bar & Milestone Engine
 * Role 1: Computes problem benchmark targets and completion percentages.
 * Role 2: Updates small water-fill containers with wave animations and dynamic gradients.
 */
(function (window) {
  'use strict';

  const TARGETS = {
    '01-numpy-100': 100,
    '02-pandas-exercises': 50,
    '03-pandas-puzzles-100': 100,
    '01-Introductory-Problems': 24,
    '02-Sorting-and-Searching': 35,
    '03-Dynamic-Programming': 19,
    '04-Graph-Algorithms': 36,
    '05-Range-Queries': 19,
    '06-Tree-Algorithms': 16,
    '07-Mathematics': 31,
    '08-String-Algorithms': 17,
    '09-Geometry': 16,
    '10-Advanced-Techniques': 24,
    '11-Additional-Problems': 77,
    'cses': 400,
    'ds-total': 250
  };

  function getTarget(folderName, defaultTarget) {
    if (!folderName) return defaultTarget || 100;
    if (TARGETS[folderName]) {
      return TARGETS[folderName];
    }
    const cleanKey = folderName.replace(/^[0-9]+[-_]/, '').toLowerCase();
    for (const [k, v] of Object.entries(TARGETS)) {
      if (k.replace(/^[0-9]+[-_]/, '').toLowerCase() === cleanKey) {
        return v;
      }
    }
    return defaultTarget || 100;
  }

  function renderWaterBar(containerEl, solvedCount, target, palette) {
    if (!containerEl) return;

    const percentage = Math.min(100, (solvedCount / target) * 100).toFixed(1);
    const gradient = palette && palette.fill ? palette.fill : 'linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%)';

    const html = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <span class="mono-tag text-uppercase fw-bold text-dark">
            Ticket Completion Progress
          </span>
          <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle mono-tag">
            Active
          </span>
        </div>
        <span class="mono-tag text-dark fw-bold">
          ${solvedCount} / ${target} Solved
        </span>
      </div>

      <div class="water-bar-container">
        <div class="water-bar-fill" style="width: 0%; background: ${gradient};"></div>
      </div>

      <div class="d-flex justify-content-between align-items-center mt-2">
        <span class="mono-tag text-muted">
          Benchmark Target: ${target} Problems in Ticket
        </span>
        <span class="mono-tag text-success fw-bold">
          ${percentage}%
        </span>
      </div>
    `;

    containerEl.innerHTML = html;

    // Trigger smooth fill animation
    setTimeout(() => {
      const fillEl = containerEl.querySelector('.water-bar-fill');
      if (fillEl) {
        fillEl.style.width = `${Math.max(percentage, 2)}%`;
      }
    }, 100);
  }

  window.AppWaterBar = {
    getTarget,
    renderWaterBar
  };
})(window);
