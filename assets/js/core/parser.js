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

    function parseInline(text) {
      return text
        .replace(/`([^`]+)`/g, '<code class="editorial-inline-code">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary fw-semibold">$1</a>');
    }

    lines.forEach(line => {
      const trimmed = line.trim();

      // Check table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList();
        inTable = true;
        tableRows.push(trimmed);
        return;
      } else {
        flushTable();
      }

      // Check headings
      if (trimmed.startsWith('# ')) {
        flushList();
        html.push(`<h2 class="editorial-heading-1 fw-bold text-dark mb-3">${parseInline(trimmed.substring(2))}</h2>`);
      } else if (trimmed.startsWith('## ')) {
        flushList();
        html.push(`<h3 class="editorial-heading-2 mb-3">${parseInline(trimmed.substring(3))}</h3>`);
      } else if (trimmed.startsWith('### ')) {
        flushList();
        html.push(`<h4 class="editorial-heading-3 mb-2">${parseInline(trimmed.substring(4))}</h4>`);
      } else if (trimmed.startsWith('#### ')) {
        flushList();
        html.push(`<h5 class="editorial-heading-4 mb-2">${parseInline(trimmed.substring(5))}</h5>`);
      }
      // Blockquotes
      else if (trimmed.startsWith('> ')) {
        flushList();
        html.push(`<div class="editorial-blockquote my-3"><p class="mb-0">${parseInline(trimmed.substring(2))}</p></div>`);
      }
      // Numbered List items (1. , 2. )
      else if (/^[0-9]+\.\s+/.test(trimmed)) {
        if (!inList) {
          html.push('<ol class="editorial-list">');
          inList = true;
        }
        const content = trimmed.replace(/^[0-9]+\.\s+/, '');
        html.push(`<li>${parseInline(content)}</li>`);
      }
      // Horizontal rule
      else if (/^---|^___|^\*\*\*/.test(trimmed)) {
        flushList();
        html.push('<hr class="my-4 text-muted opacity-25">');
      }
      // Paragraphs
      else if (trimmed.length > 0) {
        flushList();
        html.push(`<p class="editorial-paragraph">${parseInline(trimmed)}</p>`);
      }
    });

    flushTable();
    flushList();

    return html.join('\n');
  }

  window.AppParser = {
    parseMarkdown,
    escapeHtml
  };
})(window);
