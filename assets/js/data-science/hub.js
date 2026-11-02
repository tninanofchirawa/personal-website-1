/**
 * Role: Unified Hub Discovery & Ticket Card Engine
 * Role 1: Aggregates top-level repository folders and solutions from git trees.
 *         Strictly filters out hidden dot folders (.github, .githooks) and empty folders.
 * Role 2: Drives overall water completion progress bar (with wave animation) if present.
 * Role 3: Builds responsive cards with dynamic emojis and palettes:
 *         - CSES Cards: Thematic emojis (AppTheme.getEmoji), colored icon container (AppTheme.getPalette),
 *           accurate benchmark solved badge, clean description, and "Open Folder →".
 *         - DS Cards: Thematic emojis, colored icon container, Ticket Spec box, and "Open Track →".
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
            if (parts.length === 1) {
              const topFolder = parts[0];
              if (!folderCounts[topFolder]) {
                folderCounts[topFolder] = 0;
              }
            }
          }
        });

        // Update overall water bar if present
        if (waterFill && statsText && percentText) {
          const overallTarget = config.targetTotal || 100;
          const percentage = Math.min(100, (totalSolvedCount / overallTarget) * 100).toFixed(1);
          statsText.textContent = `${totalSolvedCount} / ${overallTarget} Solved`;
          percentText.textContent = `${percentage}%`;
          waterFill.style.width = `${percentage}%`;
        }

        // Render Cards (filter out empty folders with 0 solutions)
        grid.innerHTML = '';
        const sortedFolders = Object.keys(folderCounts)
          .filter(name => folderCounts[name] > 0)
          .sort();

        if (sortedFolders.length === 0) {
          grid.innerHTML = `
            <div class="col-12 text-center py-5">
              <p class="text-muted mono-tag">No problem tracks or solutions found yet.</p>
            </div>
          `;
        } else {
          sortedFolders.forEach(folderName => {
            const count = folderCounts[folderName];
            const cleanTitle = folderName.replace(/^[0-9]+[-_]/, '').replace(/[-_]/g, ' ');
            const target = window.AppWaterBar ? window.AppWaterBar.getTarget(folderName, 50) : 50;
            const palette = window.AppTheme ? window.AppTheme.getPalette(folderName) : { badge: 'bg-primary-subtle text-primary border-primary-subtle', icon: 'bg-primary-subtle text-primary' };
            const emoji = window.AppTheme ? window.AppTheme.getEmoji(folderName) : '📁';

            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';

            // Determine if CSES or DS
            const isCSES = (config.repo || '').toLowerCase().includes('cses');

            card.innerHTML = `
              <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-3 ${palette.icon}" style="width: 48px; height: 48px;">
                    <span class="fs-4">${emoji}</span>
                  </div>
                  <span class="badge ${palette.badge} border rounded-pill px-3 py-2 mono-tag">
                    ${count} / ${target} Solved
                  </span>
                </div>

                <h5 class="fw-bold text-dark mb-1 text-capitalize">${cleanTitle}</h5>
                <p class="text-muted small mb-3">Module Directory: <code>${folderName}</code></p>

                ${isCSES ? `
                  <div class="ticket-box p-3 border-start border-3 border-success mb-3 flex-grow-1">
                    <span class="text-uppercase fw-bold text-muted mono-tag d-block mb-1">C++ Benchmark</span>
                    <p class="small text-secondary mb-0">
                      Standard solutions and clean algorithmic logic for the ${cleanTitle} section.
                    </p>
                  </div>
                ` : `
                  <div class="ticket-box p-3 border-start border-3 border-primary mb-3 flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="text-uppercase fw-bold text-muted mono-tag">Ticket Spec</span>
                      <span class="badge bg-white text-secondary border px-2 py-1 mono-tag">${config.badgeLang || 'Python'}</span>
                    </div>
                    <p class="small text-secondary mb-2 mt-1">
                      Contains handwritten solutions, step-by-step logic, and data analysis exercises.
                    </p>
                    <div class="d-flex align-items-center gap-2 pt-2 border-top border-light-subtle">
                      <span class="text-muted small font-monospace" style="font-size: 0.72rem;">Target: ${target} exercises</span>
                    </div>
                  </div>
                `}

                <div class="pt-2 mt-auto border-top">
                  <a href="${config.folderPage}?folder=${encodeURIComponent(folderName)}"
                     class="stretched-link text-primary text-decoration-none small fw-semibold">
                    ${isCSES ? 'Open Folder' : 'Open Track'} &rarr;
                  </a>
                </div>
              </div>
            `;
            grid.appendChild(card);
          });
        }

        loader.classList.add('d-none');
        grid.classList.remove('d-none');
      })
      .catch(err => {
        console.error('Hub error:', err);
        loader.innerHTML = `
          <div class="alert alert-warning mono-tag text-center" role="alert">
            Unable to load track items at this time. Please check your network connection or try again later.
          </div>
        `;
      });
  }

  window.AppHub = {
    initHub
  };
})(window);
