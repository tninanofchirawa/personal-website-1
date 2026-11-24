/**
 * Canonical 4-Section Description: 02-pandas-exercises
 * Pandas Data Wrangling Exercises — Handwritten Solutions
 */
(function (window) {
  'use strict';

  window.TICKET_DESCRIPTIONS = window.TICKET_DESCRIPTIONS || {};

  window.TICKET_DESCRIPTIONS['02-pandas-exercises'] = `
    <!-- 1) MAIN HEADING -->
    <div class="mb-4">
      <h2 class="editorial-heading-1 fw-bold text-dark mb-2">
        📊 Pandas Data Wrangling Exercises — Handwritten Solutions
      </h2>
      <div class="d-flex flex-wrap gap-2">
        <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle mono-tag">Python 3.9+</span>
        <span class="badge bg-dark-subtle text-dark border border-dark-subtle mono-tag">Pandas</span>
        <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle mono-tag">Data Cleaning</span>
      </div>
    </div>

    <!-- 2) INITIAL QUOTE AND PARAGRAPH -->
    <div class="editorial-blockquote my-4">
      <p class="mb-0">
        "Real-world data is dirty, unindexed, and full of NaN traps. Tame it with vectorized filtering, grouping, and clean schema joins."
      </p>
    </div>

    <div class="ticket-markdown-body mb-4">
      <p class="editorial-paragraph">
        Welcome to <strong>Pandas Data Wrangling Exercises — Handwritten Solutions!</strong> 📊
      </p>
      <p class="editorial-paragraph">
        This repository contains structured solutions to canonical Pandas exercises, focusing on practical data transformation, aggregation, and cleanup pipelines.
      </p>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 3) REPO STRUCTURE AND PROGRESS -->
    <div class="mb-4">
      <h3 class="editorial-heading-2 mb-3">🧭 Repository Structure &amp; Progress</h3>
      <div class="markdown-table-wrapper">
        <table class="markdown-table">
          <thead>
            <tr><th>Directory</th><th>Core Topics</th><th>Key Operations</th><th class="text-center">Status</th></tr>
          </thead>
          <tbody>
            <tr><td><code>01-filtering-and-sorting/</code></td><td>Filtering &amp; Sorting</td><td>Boolean indexing, .loc, .iloc, query</td><td class="text-center"><span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 mono-tag">🔄 In Progress</span></td></tr>
            <tr><td><code>02-grouping-and-aggregation/</code></td><td>Grouping &amp; Aggregation</td><td>groupby, agg, pivot tables</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
            <tr><td><code>03-merging-and-joining/</code></td><td>Merging &amp; Joining</td><td>inner/outer/left joins, merge, concat</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
            <tr><td><code>04-time-series-and-dates/</code></td><td>Time Series</td><td>Datetime conversion, resampling, rolling</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 4) HOW TO APPROACH -->
    <div class="mb-2">
      <h3 class="editorial-heading-2 mb-3">💡 How to Approach These Puzzles</h3>
      <ol class="editorial-list">
        <li><strong>Never iterate with loops.</strong> Always prefer vector methods or numpy arrays.</li>
        <li><strong>Use explicit indexers.</strong> Stick with .loc and .iloc to avoid warnings.</li>
        <li><strong>Embrace method chaining.</strong> Keep multi-step transforms readable.</li>
      </ol>
    </div>
  `;
})(window);
