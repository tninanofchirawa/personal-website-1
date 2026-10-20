/**
 * Role: GitHub Repository API & Session Caching
 * Role 1: Fetches recursive git trees from GitHub API.
 * Role 2: Manages sessionStorage caching with TTL to avoid rate-limiting.
 */
(function (window) {
  'use strict';

  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async function fetchTree(user, repo, branch) {
    const cacheKey = `repo_tree_${user}_${repo}_${branch}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data) {
          return parsed.data;
        }
      }
    } catch (e) {
      // Storage access blocked (e.g. privacy mode)
    }

    const url = `https://api.github.com/repos/${user}/${repo}/git/trees/${branch}?recursive=1`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`GitHub API returned HTTP ${response.status}`);
    }
    const data = await response.json();

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {
      // Quota exceeded
    }

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
    fetchRawFile
  };
})(window);
