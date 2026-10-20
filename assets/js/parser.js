/**
 * Role: Markdown & Table Parsing Engine
 * Role 1: Converts GitHub Markdown (headings, quotes, tables, lists) to styled HTML.
 * Role 2: Sanitizes and formats markdown blocks for ticket specs.
 */
(function (window) {
  'use strict';

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function parseMarkdown(md) {
    if (!md) return '';

    const lines = md.split(/\r?\n/);
    const html = [];
    let inList = false;
    let inTable = false;
    let tableRows = [];

    function flushTable() {
      if (!inTable) return;
      if (tableRows.length > 0) {
        let tHtml = '<div class="markdown-table-wrapper"><table class="markdown-table">';
        tableRows.forEach((row, rIdx) => {
          const cells = row.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
          if (rIdx === 0) {
            tHtml += '<thead><tr>' + cells.map(c => `<th>${parseInline(c)}</th>`).join('') + '</tr></thead><tbody>';
          } else if (rIdx === 1 && cells.every(c => /^:?-+:?$/.test(c))) {
            // separator row, skip
          } else {
            tHtml += '<tr>' + cells.map(c => `<td>${parseInline(c)}</td>`).join('') + '</tr>';
          }
        });
        tHtml += '</tbody></table></div>';
        html.push(tHtml);
      }
      tableRows = [];
      inTable = false;
    }

    function flushList() {
      if (inList) {
        html.push('</ol>');
        inList = false;
      }
    }

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Table line
      if (line.startsWith('|') && line.endsWith('|')) {
        flushList();
        inTable = true;
        tableRows.push(line);
        continue;
      } else {
        flushTable();
      }

      // Empty line
      if (!line) {
        flushList();
        continue;
      }

      // Headings
      if (line.startsWith('# ')) {
        flushList();
        html.push(`<h2 class="editorial-heading-1 fw-bold text-dark">${parseInline(line.slice(2))}</h2>`);
        continue;
      }
      if (line.startsWith('## ')) {
        flushList();
        html.push(`<h3 class="editorial-heading-2">${parseInline(line.slice(3))}</h3>`);
        continue;
      }
      if (line.startsWith('### ')) {
        flushList();
        html.push(`<h4 class="editorial-heading-3">${parseInline(line.slice(4))}</h4>`);
        continue;
      }

      // Blockquotes
      if (line.startsWith('>')) {
        flushList();
        const quoteText = line.replace(/^>\s*/, '');
        html.push(`<div class="editorial-blockquote my-3"><p class="mb-0">${parseInline(quoteText)}</p></div>`);
        continue;
      }

      // Horizontal rule
      if (line === '---' || line === '***' || line === '___') {
        flushList();
        html.push('<hr class="my-4 text-muted opacity-25">');
        continue;
      }

      // Numbered List (e.g. 1. Item)
      const numMatch = line.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        if (!inList) {
          html.push('<ol class="editorial-list">');
          inList = true;
        }
        html.push(`<li>${parseInline(numMatch[2])}</li>`);
        continue;
      }

      // Bullet List
      if (line.startsWith('- ') || line.startsWith('* ')) {
        flushList();
        html.push(`<div class="editorial-paragraph mb-2">&bull; ${parseInline(line.slice(2))}</div>`);
        continue;
      }

      // Standard paragraph
      flushList();
      html.push(`<p class="editorial-paragraph">${parseInline(line)}</p>`);
    }

    flushTable();
    flushList();

    return html.join('\n');
  }

  function parseInline(text) {
    if (!text) return '';
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="editorial-inline-code">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary fw-semibold">$1</a>');
  }

  window.AppParser = {
    parseMarkdown,
    parseInline
  };
})(window);
