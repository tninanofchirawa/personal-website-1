/**
 * Role: Unified Detail Viewer & Solution Code Engine
 * Role 1: Generalizes detail pages for both Data Science and CSES:
 *         - DS Tickets: Renders 4-section Description Card -> Small Water Progress Container ->
 *           Subfolder Mini Folders (NO water bar inside mini folders) -> Solution Code Cards.
 *         - CSES Folders: Updates directory title, file counter, and GitHub folder link, then renders
 *           lined-up C++ Solution Code Cards linking directly to GitHub source files.
 * Role 2: Strictly removes any "readme synced" badges from ticket cards as requested.
 */
(function (window) {
  'use strict';

  async function initViewer(config) {
    const urlParams = new URLSearchParams(window.location.search);
    const folder = urlParams.get('folder') || urlParams.get('ticket') || '';

    const titleEl = document.getElementById('folder-title');
    const counterEl = document.getElementById('file-counter');
    const loaderEl = document.getElementById('folder-loader');
    const gridEl = document.getElementById('files-grid');
    const ghLinkEl = document.getElementById('github-folder-link');
    const descBoxEl = document.getElementById('ticket-description-box');
    const descContentEl = document.getElementById('ticket-description-content');
    const waterContainerEl = document.getElementById('ticket-water-container');

    if (!folder) {
      if (titleEl) titleEl.textContent = 'Category Not Found';
      if (counterEl) counterEl.textContent = 'No folder parameter specified in URL.';
      if (loaderEl) loaderEl.classList.add('d-none');
      return;
    }

    const cleanTitle = folder.replace(/[-_]/g, ' ');
    if (titleEl) titleEl.textContent = cleanTitle;
    if (ghLinkEl) {
      ghLinkEl.href = `https://github.com/${config.user}/${config.repo}/tree/${config.branch}/${encodeURIComponent(folder)}`;
    }

    // 1. Description Rendering (For DS tickets if element exists)
    if (descBoxEl && descContentEl) {
      const customDesc = window.AppDescriptions ? window.AppDescriptions.getDescription(folder) : null;
      if (customDesc) {
        descContentEl.innerHTML = customDesc;
        descBoxEl.classList.remove('d-none');
      } else {
        try {
          const rawMd = await window.AppApi.fetchRawFile(config.user, config.repo, config.branch, `${folder}/README.md`);
          descContentEl.innerHTML = window.AppParser.parseMarkdown(rawMd);
          descBoxEl.classList.remove('d-none');
        } catch (e) {
          // No README found, hide box
          descBoxEl.classList.add('d-none');
        }
      }
    }

    // 2. Fetch repo tree and render submodules / code cards
    try {
      const data = await window.AppApi.fetchTree(config.user, config.repo, config.branch);
      const prefix = folder.endsWith('/') ? folder : folder + '/';
      const itemsInFolder = (data.tree || []).filter(item => item.path.startsWith(prefix));

      // Separate direct files vs subfolder modules
      const submodules = {};
      const directFiles = [];
      let totalSolvedCount = 0;

      itemsInFolder.forEach(item => {
        const relPath = item.path.substring(prefix.length);
        const parts = relPath.split('/');
        const filename = parts[parts.length - 1];

        // Skip README, gitkeep, or hidden dot files
        if (/^(\.gitkeep|readme\.(md|txt)|notes\.md)$/i.test(filename) || filename.startsWith('.')) {
          return;
        }

        if (parts.length > 1) {
          const subDir = parts[0];
          if (item.type === 'blob' && /\.(cpp|cc|c|py|ipynb|java)$/i.test(filename)) {
            submodules[subDir] = submodules[subDir] || [];
            submodules[subDir].push({
              name: filename,
              path: item.path,
              relPath: relPath
            });
            totalSolvedCount++;
          }
        } else if (item.type === 'blob' && /\.(cpp|cc|c|py|ipynb|java)$/i.test(filename)) {
          directFiles.push({
            name: filename,
            path: item.path,
            relPath: relPath
          });
          totalSolvedCount++;
        }
      });

      // Update small water container directly UNDER description
      if (waterContainerEl) {
        const target = window.AppWaterBar ? window.AppWaterBar.getTarget(folder, 50) : 50;
        const palette = window.AppTheme ? window.AppTheme.getPalette(folder) : null;
        if (window.AppWaterBar) {
          window.AppWaterBar.renderWaterBar(waterContainerEl, totalSolvedCount, target, palette);
        }
      }

      if (counterEl) {
        counterEl.textContent = `${totalSolvedCount} problem solution files found in this category`;
      }

      gridEl.innerHTML = '';

      // Render Submodules as Clean Mini-Cards (Strictly NO water bar inside subfolders)
      const subKeys = Object.keys(submodules).sort();
      if (subKeys.length > 0) {
        subKeys.forEach(subName => {
          const files = submodules[subName];
          const cleanSubTitle = subName.replace(/^[0-9]+[-_]/, '').replace(/[-_]/g, ' ');

          const subCard = document.createElement('div');
          subCard.className = 'col-12 mb-3';
          subCard.innerHTML = `
            <div class="card p-3 p-md-4 rounded-4 shadow-sm border border-light-subtle bg-white">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-5">📂</span>
                  <h5 class="fw-bold text-dark mb-0 text-capitalize">${cleanSubTitle}</h5>
                </div>
                <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle mono-tag">
                  ${files.length} Solutions
                </span>
              </div>
              <div class="row g-2">
                ${files.map(f => {
                  const rawUrl = `https://github.com/${config.user}/${config.repo}/blob/${config.branch}/${encodeURIComponent(f.path)}`;
                  return `
                    <div class="col-12 col-sm-6 col-md-4">
                      <a href="${rawUrl}" target="_blank" rel="noopener noreferrer"
                         class="code-box-card h-100 p-2 px-3 rounded-3 border text-decoration-none">
                        <div class="d-flex align-items-center justify-content-between">
                          <span class="small fw-semibold text-dark text-truncate">${f.name}</span>
                          <span class="text-primary small arrow-icon">&rarr;</span>
                        </div>
                      </a>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
          gridEl.appendChild(subCard);
        });
      }

      // Render Direct Files
      if (directFiles.length > 0) {
        directFiles.sort((a, b) => a.name.localeCompare(b.name)).forEach(f => {
          const rawUrl = `https://github.com/${config.user}/${config.repo}/blob/${config.branch}/${encodeURIComponent(f.path)}`;
          const card = document.createElement('div');
          card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
          card.innerHTML = `
            <a href="${rawUrl}" target="_blank" rel="noopener noreferrer"
               class="code-box-card rounded-4 p-3 border text-decoration-none card-hover-effect">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-light text-secondary border mono-tag">
                  ${f.name.split('.').pop().toUpperCase()}
                </span>
                <span class="text-primary small arrow-icon">&rarr;</span>
              </div>
              <h6 class="fw-bold text-dark mb-0 text-truncate" title="${f.name}">${f.name}</h6>
              <span class="text-muted small mt-2 d-block" style="font-size: 0.72rem;">Inspect Source &rarr;</span>
            </a>
          `;
          gridEl.appendChild(card);
        });
      }

      if (subKeys.length === 0 && directFiles.length === 0) {
        gridEl.innerHTML = `
          <div class="col-12 text-center py-4">
            <p class="text-muted mono-tag">No solution code files found in this category yet.</p>
          </div>
        `;
      }

      loaderEl.classList.add('d-none');
      gridEl.classList.remove('d-none');
    } catch (err) {
      console.error('Viewer error:', err);
      const isRateLimit = err && (err.isRateLimit || err.status === 403 || err.status === 429);
      const folderUrl = `https://github.com/${config.user}/${config.repo}/tree/${config.branch}/${encodeURIComponent(folder)}`;

      loaderEl.innerHTML = `
        <div class="col-12 my-3">
          <div class="card p-4 p-md-5 text-center border border-warning-subtle rounded-4 bg-light shadow-sm">
            <div class="mb-3 fs-1">🛡️</div>
            <h4 class="fw-bold text-dark mb-2">
              ${isRateLimit ? 'GitHub API Rate Limit Safeguard' : 'Directory Sync Notice'}
            </h4>
            <p class="text-secondary small mb-4 col-md-8 mx-auto" style="line-height: 1.6;">
              ${isRateLimit
                ? 'Unauthenticated requests to the GitHub API are capped at 60 requests/hr per IP. You can browse all source code files and notebooks in this folder directly on GitHub!'
                : 'Unable to sync files from GitHub at this moment. You can view all files in this directory directly on GitHub!'}
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-3">
              <a href="${folderUrl}" target="_blank" rel="noopener noreferrer"
                 class="btn btn-outline-dark btn-sm rounded-pill px-4 py-2 mono-tag">
                Open Directory on GitHub &rarr;
              </a>
              <button type="button" onclick="window.location.reload()"
                 class="btn btn-primary btn-sm rounded-pill px-4 py-2 mono-tag">
                Retry Sync
              </button>
            </div>
          </div>
        </div>
      `;
      loaderEl.classList.remove('d-none');
    }
  }

  window.AppViewer = {
    initViewer
  };
})(window);
