/**
 * Canonical 4-Section Description: 03-pandas-puzzles-100
 * 100 Pandas Puzzles — Handwritten Solutions
 */
(function (window) {
  'use strict';

  window.TICKET_DESCRIPTIONS = window.TICKET_DESCRIPTIONS || {};

  window.TICKET_DESCRIPTIONS['03-pandas-puzzles-100'] = `
    <!-- 1) MAIN HEADING -->
    <div class="mb-4">
      <h2 class="editorial-heading-1 fw-bold text-dark mb-2">
        🧩 100 Pandas Puzzles — Handwritten Solutions
      </h2>
      <div class="d-flex flex-wrap gap-2">
        <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle mono-tag">Python 3.9+</span>
        <span class="badge bg-dark-subtle text-dark border border-dark-subtle mono-tag">Pandas</span>
        <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle mono-tag">Test-Driven</span>
      </div>
    </div>

    <!-- 2) INITIAL QUOTE AND PARAGRAPH -->
    <div class="editorial-blockquote my-4">
      <p class="mb-0">
        "Solving practical DataFrame problems with competitive programming discipline—writing test-driven solutions without slow row loops."
      </p>
    </div>

    <div class="ticket-markdown-body mb-4">
      <p class="editorial-paragraph">
        Welcome to <strong>100 Pandas Puzzles — Handwritten Solutions!</strong> 🧩
      </p>
      <p class="editorial-paragraph">
        Inspired by the canonical repository by ajcr, this collection tackles 100 test-driven puzzles covering subtle corner cases, string transformations, grouping heuristics, and rolling calculations.
      </p>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 3) REPO STRUCTURE AND PROGRESS -->
    <div class="mb-4">
      <h3 class="editorial-heading-2 mb-3">🧭 Repository Structure &amp; Progress</h3>
      <div class="markdown-table-wrapper">
        <table class="markdown-table">
          <thead>
            <tr><th>Section</th><th>Core Topics</th><th>Key Operations</th><th class="text-center">Status</th></tr>
          </thead>
          <tbody>
            <tr><td><code>01-dataframe-basics/</code></td><td>Creation &amp; Shapes</td><td>Indexing, column renaming, slicing</td><td class="text-center"><span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 mono-tag">🔄 In Progress</span></td></tr>
            <tr><td><code>02-filtering-and-values/</code></td><td>Value Filtering</td><td>Imputation, clipping, boolean masks</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
            <tr><td><code>03-string-operations/</code></td><td>String Vectorization</td><td>Regex, split, strip, replace</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
            <tr><td><code>04-window-and-time/</code></td><td>Window Calculations</td><td>Rolling, cumulative sums, multi-indexes</td><td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 4) HOW TO APPROACH -->
    <div class="mb-2">
      <h3 class="editorial-heading-2 mb-3">💡 How to Approach These Puzzles</h3>
      <ol class="editorial-list">
        <li><strong>Read assertions first.</strong> Identify exact expected dtypes and indices.</li>
        <li><strong>Check built-ins.</strong> Use vectorized methods like clip, cumsum, explode.</li>
        <li><strong>Treat DataFrames as immutable.</strong> Keep transforms reproducible and pure.</li>
      </ol>
    </div>
  `;
})(window);
