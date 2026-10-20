/**
 * Role: Unified Detail Viewer & Solution Code Engine
 * Role 1: Generalizes detail pages for both Data Science and CSES:
 *         - DS Tickets: If present, renders 4-section Description Card -> Small Water Progress Container ->
 *           Subfolder Mini Folders (NO water bar inside mini folders) -> Solution Code Cards.
 *         - CSES Folders: Cleanly updates directory title, file counter, and GitHub folder link, then renders
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
          descBoxEl.classList.add('d-none');
        }
      }
    }

    // 2. Fetch repository tree for subfolders and solution files
    try {
      const data = await window.AppApi.fetchTree(config.user, config.repo, config.branch);
      const prefix = folder + '/';
      const subfolderCounts = {};
      const directFiles = [];
      let totalSolvedCount = 0;

      (data.tree || []).forEach(item => {
        if (!item.path.startsWith(prefix)) return;

        const relPath = item.path.slice(prefix.length);
        const parts = relPath.split('/');

        if (item.type === 'blob') {
          const filename = parts[parts.length - 1];

          // Exclude documentation or gitkeep files from answer counts
          if (/^(\.gitkeep|readme\.(md|txt)|notes\.md)$/i.test(filename)) {
            return;
          }

          if (/\.(cpp|cc|c|py|ipynb|java)$/i.test(filename)) {
            totalSolvedCount++;

            if (parts.length === 1) {
              directFiles.push({ name: filename, path: item.path });
            } else {
              const sub = parts[0];
              subfolderCounts[sub] = (subfolderCounts[sub] || 0) + 1;
            }
          }
        } else if (item.type === 'tree' && parts.length === 1 && !parts[0].startsWith('.')) {
          const sub = parts[0];
          subfolderCounts[sub] = subfolderCounts[sub] || 0;
        }
      });

      // Update counter text
      if (counterEl) {
        const noun = config.lang === 'C++' ? 'Problem' : 'Solution';
        counterEl.textContent = `${totalSolvedCount} Solved ${noun}${totalSolvedCount === 1 ? '' : 's'}`;
      }

      // 3. Render Small Water Container UNDER description (For DS Tickets if element exists)
      if (waterContainerEl && window.AppWaterBar) {
        const benchmark = window.AppWaterBar.getTarget(folder, parseInt(config.ticketTarget, 10) || 100);
        const palette = window.AppTheme.getPalette(folder);
        window.AppWaterBar.renderWaterBar(waterContainerEl, totalSolvedCount, benchmark, palette);
        waterContainerEl.classList.remove('d-none');
      }

      // 4. Render Subfolder Mini Tickets & Code Files (NO water container in mini folders!)
      let cardsHtml = '';
      const subfolders = Object.keys(subfolderCounts).filter(sub => !sub.startsWith('.')).sort();

      // Render Subfolders (For DS giant folders / modules)
      subfolders.forEach(sub => {
        const subCount = subfolderCounts[sub];
        const subClean = sub.replace(/[-_]/g, ' ');
        const subUrl = `https://github.com/${config.user}/${config.repo}/tree/${config.branch}/${folder}/${sub}`;
        const palette = window.AppTheme.getPalette(sub);
        const emoji = window.AppTheme.getEmoji(sub);

        cardsHtml += `
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 shadow-sm border rounded-4 p-4 bg-white d-flex flex-column position-relative card-hover-effect">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div class="d-inline-flex align-items-center justify-content-center ${palette.icon} rounded-3" style="width: 44px; height: 44px;">
                  <span class="fs-4">${emoji}</span>
                </div>
                <span class="badge ${palette.badge} rounded-pill px-3 py-1 mono-tag">
                  Module
                </span>
              </div>

              <h6 class="fw-bold text-dark mb-1 text-capitalize text-truncate">${subClean}</h6>
              <p class="text-muted small mb-3">Topic Subdirectory</p>

              <div class="ticket-box p-3 border-start border-3 border-primary mb-3 flex-grow-1">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="text-uppercase fw-bold text-muted mono-tag" style="letter-spacing: 0.04em;">Module Spec</span>
                  <span class="text-muted mono-tag">Ready</span>
                </div>
                <p class="small text-secondary mb-2 mt-1">
                  Subdirectory containing problem implementations and exercise scripts.
                </p>
                <div class="d-flex align-items-center gap-2 pt-2 border-top border-light-subtle">
                  <span class="badge bg-white text-dark border px-2 py-1 mono-tag">Files: ${subCount}</span>
                  <span class="badge bg-white text-muted border px-2 py-1 mono-tag">${config.badgeLang || 'Python'}</span>
                </div>
              </div>

              <div class="pt-2 mt-auto border-top">
                <a href="${subUrl}" target="_blank" rel="noopener noreferrer" class="stretched-link text-primary text-decoration-none small fw-semibold">
                  Inspect on GitHub &rarr;
                </a>
              </div>
            </div>
          </div>
        `;
      });

      // Render Direct Code Solution Cards (CSES solutions & DS direct files)
      directFiles.sort((a, b) => a.name.localeCompare(b.name));
      directFiles.forEach(file => {
        const fileClean = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const fileUrl = `https://github.com/${config.user}/${config.repo}/blob/${config.branch}/${file.path}`;

        cardsHtml += `
          <div class="col-12 col-md-6 col-lg-4">
            <a href="${fileUrl}" target="_blank" rel="noopener noreferrer" class="code-box-card">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="d-flex align-items-center gap-2">
                  <span class="fs-5">📄</span>
                  <span class="mono-tag text-uppercase fw-bold text-secondary">${config.badgeLang || 'Code'} Solution</span>
                </div>
                <span class="arrow-icon text-muted small">&rarr;</span>
              </div>
              <div>
                <h6 class="fw-bold text-dark text-capitalize mb-1 text-truncate">${fileClean}</h6>
                <span class="mono-tag text-muted small text-truncate d-block">${file.name}</span>
              </div>
            </a>
          </div>
        `;
      });

      if (loaderEl) loaderEl.classList.add('d-none');
      if (gridEl) {
        gridEl.innerHTML = cardsHtml || '<div class="col-12 text-center py-4 text-muted mono-tag">No solution files found in this category yet.</div>';
        gridEl.classList.remove('d-none');
      }
    } catch (err) {
      console.warn('Viewer API load error:', err);
      if (loaderEl) loaderEl.classList.add('d-none');
      if (gridEl) {
        gridEl.innerHTML = `
          <div class="col-12 text-center py-4">
            <p class="text-danger mono-tag mb-2">Could not fetch files from GitHub API.</p>
            <a href="https://github.com/${config.user}/${config.repo}/tree/${config.branch}/${encodeURIComponent(folder)}"
               target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-sm rounded-pill mono-tag">
              Inspect ${cleanTitle} Directly on GitHub &rarr;
            </a>
          </div>
        `;
        gridEl.classList.remove('d-none');
      }
    }
  }

  window.AppViewer = {
    initViewer
  };
})(window);
