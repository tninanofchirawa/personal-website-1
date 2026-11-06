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

              // Strictly exclude README, gitkeep, or non-solution files from solved count
              if (/^(\.gitkeep|readme\.(md|txt)|notes\.md)$/i.test(filename)) {
                if (folderCounts[topFolder] === undefined) {
                  folderCounts[topFolder] = 0;
                }
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

        // Determine if CSES or Data Science repository
        const isCSES = (config.repo || '').toLowerCase().includes('cses');

        // For Data Science: guarantee that canonical study tracks & registered descriptions are present
        if (!isCSES) {
          const canonicalTracks = ['01-numpy-100', '02-pandas-exercises', '03-pandas-puzzles-100'];
          canonicalTracks.forEach(track => {
            if (folderCounts[track] === undefined) {
              folderCounts[track] = 0;
            }
          });
          if (window.TICKET_DESCRIPTIONS) {
            Object.keys(window.TICKET_DESCRIPTIONS).forEach(track => {
              if (folderCounts[track] === undefined) {
                folderCounts[track] = 0;
              }
            });
          }
        }

        // Update overall water bar if present
        if (waterFill && statsText && percentText) {
          const overallTarget = config.targetTotal || 100;
          const percentage = Math.min(100, (totalSolvedCount / overallTarget) * 100).toFixed(1);
          statsText.textContent = `${totalSolvedCount} / ${overallTarget} Solved`;
          percentText.textContent = `${percentage}%`;
          waterFill.style.width = `${percentage}%`;
        }

        // Render Cards:
        // - CSES: hide empty categories with 0 solutions
        // - Data Science: show all active problem tracks & study guides
        grid.innerHTML = '';
        const sortedFolders = Object.keys(folderCounts)
          .filter(name => {
            if (name.startsWith('.')) return false;
            if (isCSES) {
              return folderCounts[name] > 0;
            }
            return true;
          })
          .sort();

        if (sortedFolders.length === 0) {
          grid.innerHTML = `
            <div class="col-12 text-center py-5">
              <p class="text-muted mono-tag">No problem tracks or solutions found yet.</p>
            </div>
          `;
        } else {
          sortedFolders.forEach(folderName => {
            const count = folderCounts[folderName] || 0;
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

        // Remove .d-none from grid and add .d-none to loader upon successful fetch
        loader.classList.add('d-none');
        grid.classList.remove('d-none');
      })
      .catch(err => {
        console.error('Hub error:', err);
        const isRateLimit = err && (err.isRateLimit || err.status === 403 || err.status === 429);
        const repoUrl = `https://github.com/${config.user}/${config.repo}`;

        // For Data Science: render the canonical study tracks so the page is never empty
        if (!isCSES) {
          const fallbackTracks = ['01-numpy-100', '02-pandas-exercises', '03-pandas-puzzles-100'];
          grid.innerHTML = '';
          fallbackTracks.forEach(folderName => {
            const cleanTitle = folderName.replace(/^[0-9]+[-_]/, '').replace(/[-_]/g, ' ');
            const target = window.AppWaterBar ? window.AppWaterBar.getTarget(folderName, 50) : 50;
            const palette = window.AppTheme ? window.AppTheme.getPalette(folderName) : { badge: 'bg-primary-subtle text-primary border-primary-subtle', icon: 'bg-primary-subtle text-primary' };
            const emoji = window.AppTheme ? window.AppTheme.getEmoji(folderName) : '📁';

            const card = document.createElement('div');
            card.className = 'col-12 col-md-6 col-lg-4';
            card.innerHTML = `
              <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-inline-flex align-items-center justify-content-center rounded-3 ${palette.icon}" style="width: 48px; height: 48px;">
                    <span class="fs-4">${emoji}</span>
                  </div>
                  <span class="badge ${palette.badge} border rounded-pill px-3 py-2 mono-tag">
                    0 / ${target} Solved
                  </span>
                </div>

                <h5 class="fw-bold text-dark mb-1 text-capitalize">${cleanTitle}</h5>
                <p class="text-muted small mb-3">Module Directory: <code>${folderName}</code></p>

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

                <div class="pt-2 mt-auto border-top">
                  <a href="${config.folderPage}?folder=${encodeURIComponent(folderName)}"
                     class="stretched-link text-primary text-decoration-none small fw-semibold">
                    Open Track &rarr;
                  </a>
                </div>
              </div>
            `;
            grid.appendChild(card);
          });
          grid.classList.remove('d-none');
        }

        // Gracefully replace #cses-loader with an informative, clean fallback card
        loader.innerHTML = `
          <div class="col-12 my-3">
            <div class="card p-4 p-md-5 text-center border border-warning-subtle rounded-4 bg-light shadow-sm">
              <div class="mb-3 fs-1">🛡️</div>
              <h4 class="fw-bold text-dark mb-2">
                ${isRateLimit ? 'GitHub API Rate Limit Safeguard Active' : 'Repository Sync Notice'}
              </h4>
              <p class="text-secondary small mb-4 col-md-8 mx-auto" style="line-height: 1.6;">
                ${isRateLimit
                  ? 'Unauthenticated requests to the GitHub API are capped at 60 requests/hr per IP. You can explore all problem sets, solution scripts, and notebooks directly in the GitHub repository!'
                  : 'Unable to sync repository tracks right now. You can explore all problem sets, solution scripts, and notebooks directly in the GitHub repository!'}
              </p>
              <div class="d-flex flex-wrap justify-content-center gap-3">
                <a href="${repoUrl}" target="_blank" rel="noopener noreferrer"
                   class="btn btn-outline-dark btn-sm rounded-pill px-4 py-2 mono-tag">
                  View Repository on GitHub &rarr;
                </a>
                <button type="button" onclick="window.location.reload()"
                   class="btn btn-primary btn-sm rounded-pill px-4 py-2 mono-tag">
                  Retry Sync
                </button>
              </div>
            </div>
          </div>
        `;
        loader.classList.remove('d-none');
      });
  }

  window.AppHub = {
    initHub
  };
})(window);
