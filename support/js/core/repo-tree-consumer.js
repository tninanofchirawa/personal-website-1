/**
 * Role: Defensive GitHub Repository Tree Consumer & Dual-Tier Cache Engine
 * Features:
 *  - 30-minute TTL Dual-Tier Cache (localStorage + sessionStorage).
 *  - Prioritizes cache: checks memory/storage before initiating network requests.
 *  - Inspects X-RateLimit-Remaining: halts subsequent calls if remaining < 3.
 *  - Handles HTTP 403 / 429 rate limit errors gracefully with styled fallback cards.
 *  - Branch resolution: falls back from 'main' to 'master' if 404 is encountered.
 *  - Cache purge helper: window.RepoTreeConsumer.purgeAllCache() for active dev.
 */
(function (window) {
  'use strict';

  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
  const CACHE_PREFIX = 'repo_tree_';
  let isRateLimited = false;

  /**
   * Generates deterministic cache key
   */
  function getCacheKey(user, repo, branch) {
    return `${CACHE_PREFIX}${user}_${repo}_${branch}`;
  }

  /**
   * Retrieves data from dual-tier cache (sessionStorage first, localStorage second)
   */
  function readCache(key) {
    // Tier 1: sessionStorage
    try {
      const sessionVal = sessionStorage.getItem(key);
      if (sessionVal) {
        const parsed = JSON.parse(sessionVal);
        if (parsed && parsed.timestamp && parsed.data) {
          const age = Date.now() - parsed.timestamp;
          if (age < CACHE_TTL) {
            return { data: parsed.data, isStale: false, age: age };
          }
        }
      }
    } catch (e) {
      // Storage access may be blocked in strict private browsing
    }

    // Tier 2: localStorage
    try {
      const localVal = localStorage.getItem(key);
      if (localVal) {
        const parsed = JSON.parse(localVal);
        if (parsed && parsed.timestamp && parsed.data) {
          const age = Date.now() - parsed.timestamp;
          if (age < CACHE_TTL) {
            // Seed back to sessionStorage
            try { sessionStorage.setItem(key, localVal); } catch (e) {}
            return { data: parsed.data, isStale: false, age: age };
          }
          // Preserve stale cache for rate-limit fallbacks
          return { data: parsed.data, isStale: true, age: age };
        }
      }
    } catch (e) {}

    return null;
  }

  /**
   * Stores data across both tiers (sessionStorage + localStorage)
   */
  function writeCache(key, data) {
    const payload = JSON.stringify({
      timestamp: Date.now(),
      data: data
    });

    try { sessionStorage.setItem(key, payload); } catch (e) {}
    try { localStorage.setItem(key, payload); } catch (e) {}
  }

  /**
   * Fetches recursive git tree with defensive rate-limiting and dual-tier cache
   */
  async function fetchTree(user, repo, branch) {
    branch = branch || 'main';
    const cacheKey = getCacheKey(user, repo, branch);

    // 1. Check dual-tier cache first BEFORE making any network calls
    const cached = readCache(cacheKey);
    if (cached && !cached.isStale) {
      return cached.data;
    }

    // 2. If rate-limit is currently active, avoid making network requests
    if (isRateLimited) {
      if (cached && cached.data) {
        console.warn(`[RepoTreeConsumer] Rate limit safeguard active. Serving cached data for ${repo}/${branch}.`);
        return cached.data;
      }
      const err = new Error('GitHub API rate limit in effect. Please view repository on GitHub.');
      err.isRateLimit = true;
      err.status = 403;
      throw err;
    }

    // 3. Make guarded network request
    const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
    let response;

    try {
      response = await fetch(url);
    } catch (netErr) {
      // Network drop: return stale cache if available
      if (cached && cached.data) {
        console.warn(`[RepoTreeConsumer] Network offline. Serving stale cached tree for ${repo}/${branch}.`);
        return cached.data;
      }
      throw netErr;
    }

    // 4. Inspect X-RateLimit-Remaining header
    const remainingHeader = response.headers.get('x-ratelimit-remaining');
    if (remainingHeader !== null) {
      const remaining = parseInt(remainingHeader, 10);
      if (!isNaN(remaining) && remaining < 3) {
        console.warn(`[RepoTreeConsumer] Critical rate limit warning! Remaining: ${remaining} requests.`);
        isRateLimited = true;
      }
    }

    // 5. Handle branch resolution: fallback from main to master if 404
    if (response.status === 404 && branch === 'main') {
      try {
        const masterUrl = `https://api.github.com/repos/${user}/${repo}/git/trees/master?recursive=1`;
        const masterRes = await fetch(masterUrl);
        if (masterRes.ok) {
          response = masterRes;
          branch = 'master';
        }
      } catch (e) {}
    }

    // 6. Handle HTTP 403 / 429 Rate Limiting
    if (response.status === 403 || response.status === 429) {
      isRateLimited = true;
      if (cached && cached.data) {
        console.warn(`[RepoTreeConsumer] HTTP ${response.status} Rate Limit encountered. Serving cached data.`);
        return cached.data;
      }
      const err = new Error(`GitHub API rate limit encountered (HTTP ${response.status})`);
      err.isRateLimit = true;
      err.status = response.status;
      throw err;
    }

    if (!response.ok) {
      if (cached && cached.data) {
        console.warn(`[RepoTreeConsumer] HTTP ${response.status}. Serving stale cache.`);
        return cached.data;
      }
      throw new Error(`GitHub API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    writeCache(cacheKey, data);
    return data;
  }

  /**
   * Purges single repo tree cache
   */
  function purgeCache(user, repo, branch) {
    branch = branch || 'main';
    const key = getCacheKey(user, repo, branch);
    try { sessionStorage.removeItem(key); } catch (e) {}
    try { localStorage.removeItem(key); } catch (e) {}
    console.log(`[RepoTreeConsumer] Purged cache for ${key}`);
  }

  /**
   * Purges all repo tree entries across sessionStorage and localStorage
   */
  function purgeAllCache() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) localStorage.removeItem(key);
      });
    } catch (e) {}

    try {
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(key);
      });
    } catch (e) {}

    isRateLimited = false;
    console.log('[RepoTreeConsumer] Purged all repository tree caches.');
  }

  /**
   * Renders a clean, informative fallback card into a container element
   */
  function renderFallback(containerEl, user, repo, branch, isRateLimit) {
    if (!containerEl) return;
    const repoUrl = `https://github.com/${user}/${repo}`;

    containerEl.innerHTML = `
      <div class="col-12 my-3">
        <div class="card p-4 p-md-5 text-center border border-warning-subtle rounded-4 bg-light shadow-sm">
          <div class="mb-3 fs-1">🛡️</div>
          <h4 class="fw-bold text-dark mb-2">
            ${isRateLimit ? 'GitHub API Rate Limit Safeguard' : 'Repository Sync Notice'}
          </h4>
          <p class="text-secondary small mb-4 col-md-8 mx-auto" style="line-height: 1.6;">
            ${isRateLimit
              ? 'Unauthenticated requests to the GitHub API are capped at 60 requests/hr per IP. All problem sets, notebooks, and solutions are fully available on GitHub!'
              : 'Unable to reach the GitHub API at this time. You can explore all files, folders, and notebooks directly in the repository.'}
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
    containerEl.classList.remove('d-none');
  }

  // Export public API
  window.RepoTreeConsumer = {
    fetchTree,
    purgeCache,
    purgeAllCache,
    renderFallback,
    isRateLimited: () => isRateLimited,
    CACHE_TTL
  };

  // Harmonize with window.AppApi
  if (window.AppApi) {
    window.AppApi.fetchTree = fetchTree;
  }
})(window);
