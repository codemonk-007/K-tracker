# Shared Design Specification for Interactive Checklists

## Output Requirements
- Pure HTML + CSS + vanilla JavaScript, NO frameworks, NO build tools, NO dependencies
- Single self-contained HTML file (all CSS and JS inline)
- Hostable directly on GitHub Pages
- Interactive checkboxes with localStorage persistence
- Responsive for mobile, tablet, desktop
- Print-friendly with @media print rules

## Navigation
All 3 pages share a nav bar at the top with links to each other:
- AI/SWE Scope → `ai-swe-scope.html`
- Core ML Scope → `core-ml-scope.html`
- HLD & LLD → `hld-lld-tracker.html`
Mark the current page's link as `.active`.

## Complete CSS Template

```css
:root {
    --bg: #fcfbf9;
    --card: #ffffff;
    --text: #2c3e50;
    --text-muted: #596a7b;
    --border: #eef0f2;
    --vh-bg: #ffebee; --vh-text: #c62828;
    --h-bg: #fff3e0; --h-text: #e65100;
    --mh-bg: #e0f7fa; --mh-text: #00838f;
    --m-bg: #e8f5e9; --m-text: #2e7d32;
    --b-bg: #f3f4f6; --b-text: #455a64;
    --lit-bg: #f3e5f5; --lit-text: #6a1b9a;
    --special-bg: #fff8e1; --special-text: #f57f17;
    /* HLD/LLD specific */
    --hld-bg: #e0f2f1; --hld-text: #00695c;
    --lld-bg: #ede7f6; --lld-text: #4527a0;
    --ai-bg: #e3f2fd; --ai-text: #1565c0;
    --p0-bg: #ffebee; --p0-text: #c62828;
    --p1-bg: #fff8e1; --p1-text: #f57f17;
    --p2-bg: #f3f4f6; --p2-text: #455a64;
    --check-done: #4caf50;
    --progress-fill: #66bb6a;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 20px 25px;
    line-height: 1.4;
    min-height: 100vh;
}
.nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 15px;
    font-size: 12px;
}
.nav a {
    color: var(--text-muted);
    text-decoration: none;
    padding: 5px 12px;
    border-radius: 5px;
    border: 1px solid var(--border);
    transition: all 0.15s;
}
.nav a.active {
    color: var(--text);
    border-color: var(--text);
    font-weight: 600;
    background: rgba(0,0,0,0.02);
}
.nav a:hover { background: var(--border); }
.header {
    text-align: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--text);
}
.header h1 {
    font-weight: 300;
    letter-spacing: 1.5px;
    font-size: 20px;
    text-transform: uppercase;
    margin-bottom: 4px;
}
.subtitle {
    font-size: 12px;
    color: var(--text-muted);
    max-width: 650px;
    margin: 0 auto 12px;
}
.overall-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 12px;
    flex-wrap: wrap;
}
.overall-bar {
    width: 220px;
    height: 7px;
    background: var(--border);
    border-radius: 4px;
    overflow: hidden;
}
.overall-bar .fill {
    height: 100%;
    background: var(--progress-fill);
    border-radius: 4px;
    transition: width 0.3s ease;
    width: 0%;
}
#overall-text {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    min-width: 100px;
}
.reset-btn {
    font-size: 10px;
    padding: 4px 10px;
    border: 1px solid #ef5350;
    color: #ef5350;
    background: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.reset-btn:hover { background: #ffebee; }

/* MASONRY GRID */
.masonry-grid {
    column-count: 3;
    column-gap: 15px;
}

/* CARDS */
.card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 14px 10px;
    margin-bottom: 15px;
    break-inside: avoid;
    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 8px;
    margin-bottom: 2px;
    border-bottom: 1px solid var(--border);
    gap: 8px;
}
.card-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
}
.card-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}
.progress-text {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.badge {
    font-size: 8px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    text-transform: uppercase;
    white-space: nowrap;
    letter-spacing: 0.3px;
}
.badge.vh { background: var(--vh-bg); color: var(--vh-text); }
.badge.h { background: var(--h-bg); color: var(--h-text); }
.badge.mh { background: var(--mh-bg); color: var(--mh-text); }
.badge.m { background: var(--m-bg); color: var(--m-text); }
.badge.b { background: var(--b-bg); color: var(--b-text); }
.badge.lit { background: var(--lit-bg); color: var(--lit-text); }
.badge.special { background: var(--special-bg); color: var(--special-text); }
/* HLD/LLD specific badges */
.badge.hld { background: var(--hld-bg); color: var(--hld-text); }
.badge.lld { background: var(--lld-bg); color: var(--lld-text); }
.badge.ai-hld { background: var(--ai-bg); color: var(--ai-text); }
.badge.p0 { background: var(--p0-bg); color: var(--p0-text); }
.badge.p1 { background: var(--p1-bg); color: var(--p1-text); }
.badge.p2 { background: var(--p2-bg); color: var(--p2-text); }

.card-progress {
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    margin: 6px 0 8px;
    overflow: hidden;
}
.card-progress .fill {
    height: 100%;
    background: var(--progress-fill);
    border-radius: 2px;
    transition: width 0.3s ease;
    width: 0%;
}
.list-group-title {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    margin: 10px 0 5px;
    letter-spacing: 0.3px;
}
.card-body > .list-group-title:first-child { margin-top: 2px; }

/* CHECKBOX ITEMS */
.item {
    display: flex;
    align-items: center;
    padding: 3px 0;
    font-size: 11.5px;
    cursor: pointer;
    user-select: none;
    color: #444;
    -webkit-tap-highlight-color: transparent;
}
.item input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
}
.item .check {
    width: 13px;
    height: 13px;
    border: 1.5px solid #b0bec5;
    border-radius: 50%;
    margin-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
}
.item:hover .check {
    border-color: #78909c;
}
.item input:checked + .check {
    background: var(--check-done);
    border-color: var(--check-done);
}
.item input:checked + .check::after {
    content: '✓';
    color: white;
    font-size: 8px;
    font-weight: 700;
    line-height: 1;
}
.item input:checked ~ .item-text {
    text-decoration: line-through;
    color: #b0b0b0;
}
.item-text {
    flex: 1;
    line-height: 1.4;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
    .masonry-grid { column-count: 2; }
}
@media (max-width: 700px) {
    body { padding: 12px; }
    .masonry-grid { column-count: 1; }
    .header h1 { font-size: 15px; letter-spacing: 1px; }
    .subtitle { font-size: 11px; }
    .item {
        padding: 5px 0;
        font-size: 13px;
    }
    .item .check {
        width: 20px;
        height: 20px;
        margin-right: 10px;
    }
    .item input:checked + .check::after {
        font-size: 11px;
    }
    .card { padding: 12px; margin-bottom: 12px; }
    .card-title { font-size: 13px; }
    .list-group-title { font-size: 11px; margin: 12px 0 6px; }
    .badge { font-size: 9px; padding: 3px 7px; }
    .nav { gap: 5px; }
    .nav a { padding: 6px 10px; font-size: 11px; }
    .overall-bar { width: 140px; }
}

/* PRINT */
@media print {
    body { padding: 10px; background: white; font-size: 10px; }
    .nav, .reset-btn, .overall-progress { display: none !important; }
    .masonry-grid { column-count: 3; column-gap: 10px; }
    .card {
        box-shadow: none;
        break-inside: avoid;
        page-break-inside: avoid;
        border: 1px solid #ccc;
        padding: 8px;
        margin-bottom: 8px;
    }
    .item .check {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
    .badge {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
    .card-progress { display: none; }
    .item { font-size: 9px; padding: 1px 0; }
    .card-title { font-size: 10px; }
    .list-group-title { font-size: 8px; margin: 5px 0 2px; }
}
```

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE</title>
<style>
/* PASTE COMPLETE CSS HERE */
</style>
</head>
<body>
<nav class="nav">
    <a href="ai-swe-scope.html" class="CLASS_IF_ACTIVE">AI/SWE Scope</a>
    <a href="core-ml-scope.html" class="CLASS_IF_ACTIVE">Core ML Scope</a>
    <a href="hld-lld-tracker.html" class="CLASS_IF_ACTIVE">HLD & LLD</a>
</nav>
<div class="header">
    <h1>PAGE TITLE</h1>
    <p class="subtitle">PAGE SUBTITLE</p>
    <div class="overall-progress">
        <div class="overall-bar"><div class="fill" id="overall-fill"></div></div>
        <span id="overall-text">0 / 0 (0%)</span>
        <button class="reset-btn" onclick="resetAll()">Reset All</button>
    </div>
</div>
<div class="masonry-grid">
    <!-- CARDS HERE -->
</div>
<script>
/* PASTE COMPLETE JS HERE (with correct STORAGE_KEY) */
</script>
</body>
</html>
```

## Card Markup Pattern

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">1. Section Title</h3>
        <div class="card-meta">
            <span class="progress-text">0/12</span>
            <span class="badge vh">Very High</span>
        </div>
    </div>
    <div class="card-progress"><div class="fill"></div></div>
    <div class="card-body">
        <div class="list-group-title">Group Name</div>
        <label class="item">
            <input type="checkbox" id="s1-1">
            <span class="check"></span>
            <span class="item-text">Item text</span>
        </label>
        <label class="item">
            <input type="checkbox" id="s1-2">
            <span class="check"></span>
            <span class="item-text">Another item</span>
        </label>
    </div>
</div>
```

## JavaScript Template

Each page uses a UNIQUE `STORAGE_KEY`. Replace `PAGE_KEY` with the actual key.

```javascript
(function() {
    const STORAGE_KEY = 'PAGE_KEY';

    function saveState() {
        const checks = {};
        document.querySelectorAll('.card input[type="checkbox"]').forEach(function(cb) {
            if (cb.id) checks[cb.id] = cb.checked;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    }

    function loadState() {
        try {
            var data = localStorage.getItem(STORAGE_KEY);
            if (!data) return;
            var checks = JSON.parse(data);
            Object.keys(checks).forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.checked = checks[id];
            });
        } catch(e) {}
    }

    function updateProgress() {
        var totalChecked = 0, totalItems = 0;
        document.querySelectorAll('.card').forEach(function(card) {
            var cbs = card.querySelectorAll('input[type="checkbox"]');
            var checked = card.querySelectorAll('input[type="checkbox"]:checked').length;
            var total = cbs.length;
            if (total === 0) return;
            totalChecked += checked;
            totalItems += total;
            var pt = card.querySelector('.progress-text');
            var pf = card.querySelector('.card-progress .fill');
            if (pt) pt.textContent = checked + '/' + total;
            if (pf) pf.style.width = (total ? (checked / total * 100) : 0) + '%';
        });
        var of = document.getElementById('overall-fill');
        var ot = document.getElementById('overall-text');
        var pct = totalItems ? Math.round(totalChecked / totalItems * 100) : 0;
        if (of) of.style.width = pct + '%';
        if (ot) ot.textContent = totalChecked + ' / ' + totalItems + ' (' + pct + '%)';
    }

    window.resetAll = function() {
        if (!confirm('Reset all progress on this page? This cannot be undone.')) return;
        localStorage.removeItem(STORAGE_KEY);
        document.querySelectorAll('.card input[type="checkbox"]').forEach(function(cb) {
            cb.checked = false;
        });
        updateProgress();
    };

    document.addEventListener('DOMContentLoaded', function() {
        loadState();
        updateProgress();
        document.querySelectorAll('.card input[type="checkbox"]').forEach(function(cb) {
            cb.addEventListener('change', function() {
                saveState();
                updateProgress();
            });
        });
    });
})();
```

## Important Rules
1. Include EVERY SINGLE item from the content specification. Do NOT skip, combine, or abbreviate.
2. Every item gets its own checkbox with a unique ID.
3. IDs follow pattern: `sN-M` where N=section number, M=item number within section. For sub-sections add a letter, e.g., `s1a-3`.
4. The progress-text initial value must show `0/TOTAL` where TOTAL is the actual count of checkboxes in that card.
5. Group items under list-group-title headers as specified in the content.
6. Badge classes: vh=Very High, h=High, mh=Medium-High, m=Medium, b=Basic, lit=Literacy, special=Special
7. For HLD/LLD page: use hld, lld, ai-hld, p0, p1, p2 badge classes as appropriate.
8. The file must be complete and valid HTML that works when opened directly in a browser.
