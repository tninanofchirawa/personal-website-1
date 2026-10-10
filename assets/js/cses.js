/**
 * CSES Problem Set Hub - Dynamic Category Loader & Progress Engine
 * Fetches repository structure from GitHub API, aggregates problem counts,
 * updates the water-fill completion bar, and renders category cards.
 */

(function () {
  'use strict';

  const CONFIG = {
    user: 'tninanofchirawa',
    repo: 'cses',
    branch: 'main',
    totalTarget: 400,
    cacheKey: 'cses_tree_cache_v1',
    cacheTtl: 5 * 60 * 1000 // 5 minutes
  };

  function initCsesHub() {
    const loader = document.getElementById('cses-loader');
    const grid = document.getElementById('cses-folder-grid');
    const waterFill = document.getElementById('cses-water-fill');
    const statsText = document.getElementById('progress-stats-text');
    const percentText = document.getElementById('percent-text');

    if (!loader || !grid) return;

    async function loadTreeData() {
      // Check session cache first to prevent rate limiting
      try {
        const cached = sessionStorage.getItem(CONFIG.cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CONFIG.cacheTtl) {
            return parsed.data;
          }
        }
      } catch (err) {
        // Storage access error (e.g. privacy mode); continue to fetch
      }

      const apiUrl = `https://api.github.com/repos/${CONFIG.user}/${CONFIG.repo}/git/trees/${CONFIG.branch}?recursive=1`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
      const data = await response.json();

      try {
        sessionStorage.setItem(CONFIG.cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: data
        }));
      } catch (err) {
        // Ignore quota/private mode errors
      }

      return data;
    }

    loadTreeData()
      .then(data => {
        const folderCounts = {};
        let totalSolvedCount = 0;

        (data.tree || []).forEach(item => {
          if (item.type === 'blob' && !item.path.startsWith('.')) {
            const parts = item.path.split('/');
            if (parts.length > 1) {
              const folder = parts[0];
              const filename = parts.slice(1).join('/');

              // Count valid code solution files
              if (/\.(cpp|cc|c|py|java)$/i.test(filename)) {
                folderCounts[folder] = (folderCounts[folder] || 0) + 1;
                totalSolvedCount++;
              }
            }
          }
        });

        // Update progress bar & stats
        const percentage = Math.min(100, ((totalSolvedCount / CONFIG.totalTarget) * 100)).toFixed(1);
        if (statsText) statsText.textContent = `${totalSolvedCount} / ${CONFIG.totalTarget} Solved`;
        if (percentText) percentText.textContent = `${percentage}%`;

        if (waterFill) {
          setTimeout(() => {
            waterFill.style.width = `${Math.max(percentage, 2)}%`;
          }, 120);
        }

        const folders = Object.keys(folderCounts).sort();

        if (folders.length === 0) {
          loader.innerHTML = '<p class="text-muted mono-tag">No folders with code found.</p>';
          return;
        }

        let html = '';
        folders.forEach(folder => {
          const count = folderCounts[folder];
          const displayName = folder.replace(/[-_]/g, ' ');
          const targetUrl = `cses-folder.html?folder=${encodeURIComponent(folder)}`;

          html += `
            <div class="col-12 col-md-6 col-lg-4">
              <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div class="d-inline-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3" style="width: 48px; height: 48px;">
                    <span class="fs-4">📁</span>
                  </div>
                  <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2 mono-tag">
                    ${count} ${count === 1 ? 'Solution' : 'Solutions'}
                  </span>
                </div>

                <h5 class="fw-bold text-dark mb-1 text-capitalize">${displayName}</h5>
                <p class="text-muted small mb-3">CSES Topic Section</p>

                <div class="ticket-box p-3 border-start border-3 border-primary mb-3 flex-grow-1">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="text-uppercase fw-bold text-muted mono-tag" style="letter-spacing: 0.04em;">Folder Spec</span>
                    <span class="text-muted mono-tag">Synced</span>
                  </div>
                  <p class="small text-secondary mb-2 mt-1">
                    Contains solved algorithmic challenges with C++ source files.
                  </p>
                  <div class="d-flex align-items-center gap-2 pt-2 border-top border-light-subtle">
                    <span class="badge bg-white text-dark border px-2 py-1 mono-tag">Files: ${count}</span>
                    <span class="badge bg-white text-muted border px-2 py-1 mono-tag">C++</span>
                  </div>
                </div>

                <div class="pt-2 mt-auto border-top">
                  <a href="${targetUrl}" class="stretched-link text-primary text-decoration-none small fw-semibold">
                    Open Folder &rarr;
                  </a>
                </div>
              </div>
            </div>
          `;
        });

        loader.classList.add('d-none');
        grid.innerHTML = html;
        grid.classList.remove('d-none');
      })
      .catch(error => {
        console.warn('CSES API loader error:', error);
        loader.innerHTML = '<p class="text-danger mono-tag">Could not load repository files at this time.</p>';
        if (statsText) statsText.textContent = 'Offline';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCsesHub);
  } else {
    initCsesHub();
  }
})();
