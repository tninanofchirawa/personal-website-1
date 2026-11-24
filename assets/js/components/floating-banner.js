/**
 * Floating Google Form Banner Controller
 * Handles the responsive bottom pill notification for the Data Collection Form.
 * Features:
 * - Slide-in entrance animation
 * - Dismissal with smooth exit transition
 * - Session-based persistence (dismissed state persists for current session)
 * - Opens Google Form in a new secure tab without leaving the site
 * - Full keyboard accessibility & touch handling
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'has_dismissed_form_banner';
  const FORM_URL = 'https://forms.gle/igHN1Q2nAU7dbyLeA';

  function isSessionDismissed() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function markSessionDismissed() {
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {
      // Storage might be disabled or quota exceeded
    }
  }

  function initFloatingBanner() {
    const banner = document.getElementById('top-banner-container');
    if (!banner) return;

    // Check if user already dismissed the banner in this session
    if (isSessionDismissed()) {
      banner.remove();
      return;
    }

    const touchArea = document.getElementById('banner-touch-area');
    const closeBtn = document.getElementById('close-banner-btn');

    // Trigger smooth slide-in animation shortly after load
    requestAnimationFrame(function () {
      setTimeout(function () {
        banner.classList.add('show');
      }, 350);
    });

    function openForm() {
      markSessionDismissed();
      window.open(FORM_URL, '_blank', 'noopener,noreferrer');
    }

    function dismissBanner(e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      markSessionDismissed();
      banner.classList.remove('show');
      setTimeout(function () {
        banner.remove();
      }, 450);
    }

    if (touchArea) {
      touchArea.addEventListener('click', openForm);
      touchArea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openForm();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', dismissBanner);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingBanner);
  } else {
    initFloatingBanner();
  }
})();
