/**
 * Role: Unified Hub Discovery & Ticket Card Engine
 * Role 1: Aggregates top-level repository folders and solutions from git trees.
 *         Strictly filters out hidden dot folders (.github, .githooks) and empty folders.
 * Role 2: Drives overall water completion progress bar (with wave animation) if present.
 * Role 3: Builds responsive cards with dynamic emojis and palettes:
 *         - CSES Cards: Features thematic emojis (AppTheme.getEmoji), colored icon container (AppTheme.getPalette),
 *           accurate benchmark solved badge, clean description, and "Open Folder →".
 *         - DS Cards: Features thematic emojis, colored icon container, Ticket Spec box, and "Open Track →".
 */
(function (window) {
  'use strict';

  function initHub(config) {
    const loader = document.getElementById('cses-loader');
    const grid = document.getElementById('cses-folder-grid');
    const waterFill = document.getElementById('cses-water-fill');
    const statsText = document.getElementById('progress-stats-text');
    const percentText = document.getElementById('percent-text');

    if (!loader || !grid) return;

    window.AppApi.fetchTree(config.user, config.repo, config.branch)
      .then(data => {
        const folderCounts = {};
        let totalSolvedCount = 0;

        (data.tree || []).forEach(item => {
          // Strictly exclude dot files and dot directories (.github, .githooks, .gitignore)
          if (item.path.startsWith('.')) return;

          if (item.type === 'blob') {
            const parts = item.path.split('/');
            if (parts.length > 1) {
              const topFolder = parts[0];
              const filename = parts[parts.length - 1];

              // Strictly exclude README, gitkeep, or non-solution files
              if (/^(\.gitkeep|readme\.(md|txt)|notes\.md)$/i.test(filename)) {
                return;
              }

              // Valid solution code files
              if (/\.(cpp|cc|c|py|ipynb|java)$/i.test(filename)) {
                folderCounts[topFolder] = (folderCounts[topFolder] || 0) + 1;
                totalSolvedCount++;
              }
            }
          } else if (item.type === 'tree') {
            const parts = item.path.split('/');
            // For DS tickets, index top-level tracks even before solution scripts are added
            if (parts.length === 1 && !parts[0].startsWith('.') && config.lang !== 'C++') {
              folderCounts[parts[0]] = folderCounts[parts[0]] || 0;
            }
          }
        });

        // Overall progress bar (CSES or DS Hub)
        if (waterFill && statsText) {
          const totalTarget = config.targetTotal || (config.lang === 'C++' ? 400 : 250);
          const percentage = Math.min(100, (totalSolvedCount / totalTarget) * 100).toFixed(1);
          statsText.textContent = `${totalSolvedCount} / ${totalTarget} Solved`;
          if (percentText) percentText.textContent = `${percentage}%`;
          setTimeout(() => {
            waterFill.style.width = `${Math.max(percentage, 2.5)}%`;
          }, 100);
        }

        // Folder filtering:
        // For CSES (C++): ONLY show folders that actually have solutions (count > 0)
        // For DS: show all active track folders
        let folders = Object.keys(folderCounts)
          .filter(folder => !folder.startsWith('.'));

        if (config.lang === 'C++' || config.repo === 'cses') {
          folders = folders.filter(folder => folderCounts[folder] > 0);
        }

        folders.sort();

        if (folders.length === 0) {
          loader.innerHTML = '<p class="text-muted mono-tag">No solution tracks found in repository.</p>';
          return;
        }

        let html = '';
        folders.forEach(folder => {
          const count = folderCounts[folder] || 0;
          const displayName = folder.replace(/[-_]/g, ' ');
          const targetUrl = `${config.folderPage || 'track-view.html'}?folder=${encodeURIComponent(folder)}`;

          // Dynamic Palette & Thematic Emoji (works identically for CSES and DS!)
          const palette = window.AppTheme ? window.AppTheme.getPalette(folder) : { icon: 'bg-primary-subtle text-primary', badge: 'bg-primary-subtle text-primary border-primary-subtle' };
          const emoji = window.AppTheme ? window.AppTheme.getEmoji(folder) : '📁';
          const benchmark = window.AppWaterBar ? window.AppWaterBar.getTarget(folder, config.lang === 'C++' ? 30 : 100) : 100;

          if (config.lang === 'C++' || config.repo === 'cses') {
            // CSES Card Layout: clean card with dynamic emoji, palette, and accurate solved ratio
            html += `
              <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-inline-flex align-items-center justify-content-center ${palette.icon} rounded-3" style="width: 48px; height: 48px;">
                      <span class="fs-4">${emoji}</span>
                    </div>
                    <span class="badge ${palette.badge} rounded-pill px-3 py-2 mono-tag">
                      ${count} / ${benchmark} Solved
                    </span>
                  </div>

                  <h5 class="fw-bold text-dark mb-1 text-capitalize">${displayName}</h5>
                  <p class="text-muted small mb-3">CSES Topic Section</p>

                  <p class="text-secondary small mb-4 flex-grow-1" style="line-height: 1.6;">
                    Contains solved algorithmic challenges with C++ source files.
                  </p>

                  <div class="pt-2 mt-auto border-top">
                    <a href="${targetUrl}" class="stretched-link text-primary text-decoration-none small fw-semibold">
                      Open Folder &rarr;
                    </a>
                  </div>
                </div>
              </div>
            `;
          } else {
            // DS Ticket Card Layout: with Ticket Spec box, dynamic emoji, and palette
            html += `
              <div class="col-12 col-md-6 col-lg-4">
                <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="d-inline-flex align-items-center justify-content-center ${palette.icon} rounded-3" style="width: 48px; height: 48px;">
                      <span class="fs-4">${emoji}</span>
                    </div>
                    <span class="badge ${palette.badge} rounded-pill px-3 py-2 mono-tag">
                      ${count} Solved / ${benchmark} Target
                    </span>
                  </div>

                  <h5 class="fw-bold text-dark mb-1 text-capitalize">${displayName}</h5>
                  <p class="text-muted small mb-3">DS Topic Track</p>

                  <div class="ticket-box p-3 border-start border-3 border-primary mb-3 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-uppercase fw-bold text-muted mono-tag" style="letter-spacing: 0.04em;">Ticket Spec</span>
                      <span class="text-muted mono-tag">Active</span>
                    </div>
                    <p class="small text-secondary mb-2 mt-1">
                      Topic track with practical handwritten solutions, vectors, and study notes.
                    </p>
                    <div class="d-flex align-items-center gap-2 pt-2 border-top border-light-subtle">
                      <span class="badge bg-white text-dark border px-2 py-1 mono-tag">Files: ${count}</span>
                      <span class="badge bg-white text-muted border px-2 py-1 mono-tag">${config.lang || 'Python'}</span>
                    </div>
                  </div>

                  <div class="pt-2 mt-auto border-top">
                    <a href="${targetUrl}" class="stretched-link text-primary text-decoration-none small fw-semibold">
                      Open Track &rarr;
                    </a>
                  </div>
                </div>
              </div>
            `;
          }
        });

        loader.classList.add('d-none');
        grid.innerHTML = html;
        grid.classList.remove('d-none');
      })
      .catch(err => {
        console.warn('Hub loader error:', err);
        loader.innerHTML = '<p class="text-muted mono-tag">Repository tracks loaded directly.</p>';
      });
  }

  window.AppHub = {
    initHub
  };
})(window);
