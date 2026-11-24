/**
 * Role: GitHub Repository API & Dual-Tier Session Caching Engine
 * Role 1: Fetches recursive git trees from GitHub API with rate-limit protection.
 * Role 2: Manages dual-tier (sessionStorage + localStorage) caching with 30-minute TTL.
 * Role 3: Inspects X-RateLimit-Remaining to halt requests when critical (< 3).
 */
(function (window) {
  'use strict';

  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes TTL
  const CACHE_PREFIX = 'repo_tree_';
  let isRateLimited = false;

  function getCacheKey(user, repo, branch) {
    return `${CACHE_PREFIX}${user}_${repo}_${branch}`;
  }

  function readCache(key) {
    // 1. Check sessionStorage
    try {
      const sessionVal = sessionStorage.getItem(key);
      if (sessionVal) {
        const parsed = JSON.parse(sessionVal);
        if (parsed && parsed.timestamp && parsed.data) {
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            return { data: parsed.data, isStale: false };
          }
        }
      }
    } catch (e) {}

    // 2. Check localStorage
    try {
      const localVal = localStorage.getItem(key);
      if (localVal) {
        const parsed = JSON.parse(localVal);
        if (parsed && parsed.timestamp && parsed.data) {
          if (Date.now() - parsed.timestamp < CACHE_TTL) {
            try { sessionStorage.setItem(key, localVal); } catch (e) {}
            return { data: parsed.data, isStale: false };
          }
          return { data: parsed.data, isStale: true };
        }
      }
    } catch (e) {}

    return null;
  }

  function writeCache(key, data) {
    const payload = JSON.stringify({
      timestamp: Date.now(),
      data: data
    });
    try { sessionStorage.setItem(key, payload); } catch (e) {}
    try { localStorage.setItem(key, payload); } catch (e) {}
  }

  async function fetchTree(user, repo, branch) {
    branch = branch || 'main';

    // If RepoTreeConsumer is already loaded, delegate to it
    if (window.RepoTreeConsumer && window.RepoTreeConsumer.fetchTree) {
      return await window.RepoTreeConsumer.fetchTree(user, repo, branch);
    }

    const cacheKey = getCacheKey(user, repo, branch);

    // 1. Check cache first before making any network calls
    const cached = readCache(cacheKey);
    if (cached && !cached.isStale) {
      return cached.data;
    }

    if (isRateLimited) {
      if (cached && cached.data) {
        console.warn(`[AppApi] Serving stale cache due to rate limit for ${repo}`);
        return cached.data;
      }
      const err = new Error('GitHub API rate limit in effect.');
      err.isRateLimit = true;
      throw err;
    }

    const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
    let response;

    try {
      response = await fetch(url);
    } catch (netErr) {
      if (cached && cached.data) return cached.data;
      throw netErr;
    }

    // Inspect X-RateLimit-Remaining
    const remainingHeader = response.headers.get('x-ratelimit-remaining');
    if (remainingHeader !== null) {
      const remaining = parseInt(remainingHeader, 10);
      if (!isNaN(remaining) && remaining < 3) {
        console.warn(`[AppApi] X-RateLimit-Remaining critical (${remaining}). Halting subsequent requests.`);
        isRateLimited = true;
      }
    }

    // Branch fallback: main -> master if 404
    if (response.status === 404 && branch === 'main') {
      try {
        const masterRes = await fetch(`https://api.github.com/repos/${user}/${repo}/git/trees/master?recursive=1`);
        if (masterRes.ok) response = masterRes;
      } catch (e) {}
    }

    if (response.status === 403 || response.status === 429) {
      isRateLimited = true;
      if (cached && cached.data) {
        return cached.data;
      }
      const err = new Error(`GitHub API rate limit exceeded (HTTP ${response.status})`);
      err.status = response.status;
      err.isRateLimit = true;
      throw err;
    }

    if (!response.ok) {
      if (cached && cached.data) return cached.data;
      throw new Error(`GitHub API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    writeCache(cacheKey, data);
    return data;
  }

  async function fetchRawFile(user, repo, branch, filePath) {
    const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch raw file: ${url}`);
    }
    return await response.text();
  }

  window.AppApi = {
    fetchTree,
    fetchRawFile,
    CACHE_TTL
  };
})(window);
