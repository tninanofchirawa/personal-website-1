/**
 * Role: Core Bootstrap & Coordinator
 * Role 1: Inspects semantic HTML data-* attributes for repo, branch, targets, and mode.
 * Role 2: Bootstraps AppHub on index/hub pages and AppViewer on ticket/folder detail pages.
 */
(function (window) {
  'use strict';

  function start() {
    const root = document.querySelector('[data-repo-user]');
    if (!root) return;

    const config = {
      user: root.getAttribute('data-repo-user'),
      repo: root.getAttribute('data-repo-name'),
      branch: root.getAttribute('data-repo-branch') || 'main',
      targetTotal: parseInt(root.getAttribute('data-target-total'), 10) || 100,
      ticketTarget: parseInt(root.getAttribute('data-ticket-target'), 10) || 100,
      folderPage: root.getAttribute('data-folder-page') || 'track-view.html',
      lang: root.getAttribute('data-folder-badge-lang') || 'Python',
      badgeLang: root.getAttribute('data-folder-badge-lang') || 'Python'
    };

    // If hub grid exists, start Hub
    if (document.getElementById('cses-folder-grid')) {
      if (window.AppHub) window.AppHub.initHub(config);
    }

    // If viewer grid exists, start Viewer
    if (document.getElementById('files-grid')) {
      if (window.AppViewer) window.AppViewer.initViewer(config);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  window.App = {
    start
  };
})(window);
