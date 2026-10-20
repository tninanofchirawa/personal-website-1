/**
 * Role: Ticket Description Registry
 * Role 1: Stores curated handwritten descriptions containing the 4 canonical sections:
 *         1) Main Heading
 *         2) Initial Quote and Paragraph
 *         3) Repo Structure and Progress
 *         4) How to approach
 * Role 2: Provides descriptions for ticket cards and ticket explorer views.
 */
(function (window) {
  'use strict';

  window.TICKET_DESCRIPTIONS = window.TICKET_DESCRIPTIONS || {};

  // Track 1: 01-numpy-100 (Directly from README as requested)
  window.TICKET_DESCRIPTIONS['01-numpy-100'] = `
    <!-- 1) MAIN HEADING -->
    <div class="mb-4">
      <h2 class="editorial-heading-1 fw-bold text-dark mb-2">
        ⚡ 100 NumPy Exercises — Handwritten Solutions
      </h2>
      <div class="d-flex flex-wrap gap-2">
        <span class="badge bg-primary-subtle text-primary border border-primary-subtle mono-tag">Python 3.9+</span>
        <span class="badge bg-dark-subtle text-dark border border-dark-subtle mono-tag">NumPy</span>
        <span class="badge bg-info-subtle text-info-emphasis border border-info-subtle mono-tag">BSD-3-Clause</span>
      </div>
    </div>

    <!-- 2) INITIAL QUOTE AND PARAGRAPH -->
    <div class="editorial-blockquote my-4">
      <p class="mb-0">
        "Life is too short to write nested Python loops over multidimensional arrays. Learn to think in arrays, embrace vectorization, and let NumPy do the heavy lifting."
      </p>
    </div>

    <div class="ticket-markdown-body mb-4">
      <p class="editorial-paragraph">
        Welcome to <strong>100 NumPy Exercises — Handwritten Solutions!</strong> ⚡
      </p>
      <p class="editorial-paragraph">
        This repository contains my solutions to the <a href="https://github.com/rougier/numpy-100" target="_blank" rel="noopener noreferrer" class="text-primary fw-semibold">100 NumPy Exercises</a> collection, an exercise set designed to develop practical proficiency with NumPy.
      </p>
      <p class="editorial-paragraph">
        From basic array creation and indexing to broadcasting, linear algebra, and advanced array manipulation, these exercises provide an opportunity to understand how NumPy works and how to use it effectively.
      </p>
      <p class="editorial-paragraph">
        The focus is on writing clear, idiomatic Python, understanding array operations, and developing a stronger foundation for scientific computing, numerical analysis, data science, and machine learning.
      </p>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 3) REPO STRUCTURE AND PROGRESS -->
    <div class="mb-4">
      <h3 class="editorial-heading-2 mb-3">
        🧭 Repository Structure &amp; Progress
      </h3>
      <p class="ticket-markdown-body mb-3">
        The solutions are organized into topic-based directories for easier navigation and revision.
      </p>

      <div class="markdown-table-wrapper">
        <table class="markdown-table">
          <thead>
            <tr>
              <th>Directory</th>
              <th>Core Topics</th>
              <th>Key Operations &amp; Concepts</th>
              <th class="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>01-vectors-and-matrices/</code></td>
              <td>Vectors &amp; Basic Matrices</td>
              <td>Array creation, <code>zeros()</code>, <code>ones()</code>, <code>arange()</code>, slicing, Boolean indexing</td>
              <td class="text-center"><span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-1 mono-tag">🔄 In Progress</span></td>
            </tr>
            <tr>
              <td><code>02-array-manipulation/</code></td>
              <td>Reshaping &amp; Broadcasting</td>
              <td><code>reshape()</code>, <code>newaxis</code>, broadcasting, transposition, flattening, views</td>
              <td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td>
            </tr>
            <tr>
              <td><code>03-linear-algebra-and-ops/</code></td>
              <td>Linear Algebra &amp; Vectorization</td>
              <td>Dot products, inner and outer products, matrix operations, <code>np.linalg</code>, norms, eigenvalues</td>
              <td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td>
            </tr>
            <tr>
              <td><code>04-advanced-and-miscellaneous/</code></td>
              <td>Advanced Arrays &amp; Memory Layouts</td>
              <td>Strides, structured arrays, universal functions, byte order, advanced indexing</td>
              <td class="text-center"><span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1 mono-tag">⏳ Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="small text-muted fst-italic mt-2 mb-0">
        *Directory names, topics, and completion statuses will be updated as work progresses.
      </p>
    </div>

    <hr class="my-4 text-muted opacity-25">

    <!-- 4) HOW TO APPROACH -->
    <div class="mb-2">
      <h3 class="editorial-heading-2 mb-3">
        💡 How to Approach These Puzzles
      </h3>
      <p class="ticket-markdown-body mb-3">
        The objective is not simply to obtain the correct output. It is to understand how NumPy represents and manipulates numerical data.
      </p>

      <ol class="editorial-list">
        <li>
          <strong>Think in arrays.</strong> Before writing an explicit Python loop, consider whether a vectorized NumPy operation can express the same computation more clearly. Loops are not inherently wrong, but array operations are often more concise and can be substantially faster.
        </li>
        <li>
          <strong>Understand views and copies.</strong> Array slicing may produce a view that shares memory with the original array, while some indexing operations create copies. Know the difference before modifying an array.
        </li>
        <li>
          <strong>Master broadcasting.</strong> Learn how NumPy aligns dimensions from right to left and when dimensions are compatible for element-wise operations.
        </li>
        <li>
          <strong>Pay attention to shapes.</strong> Check array dimensions, axes, and data types whenever an operation produces an unexpected result.
        </li>
        <li>
          <strong>Explore memory layout.</strong> Understand the relationship between shape, strides, contiguity, and views to make better decisions when working with large arrays.
        </li>
        <li>
          <strong>Experiment with alternatives.</strong> Compare implementations for readability, correctness, and performance instead of assuming that a shorter expression is always faster.
        </li>
      </ol>

      <p class="ticket-markdown-body mb-0">
        The goal is to develop an array-oriented way of thinking that transfers to larger scientific computing and data science problems.
      </p>
    </div>
  `;

  // Track 2: 02-pandas-exercises
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

  // Track 3: 03-pandas-puzzles-100
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

  function getDescription(folder) {
    if (!folder) return null;
    return window.TICKET_DESCRIPTIONS[folder] || null;
  }

  window.AppDescriptions = {
    getDescription
  };
})(window);
