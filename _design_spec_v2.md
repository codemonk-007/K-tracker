# Design Specification v2 — Clustered & Styled

## KEY CHANGES FROM V1
1. **Clustering**: Related sub-topics are grouped into clusters. Each cluster = ONE checkbox with a bold title + gray descriptive sub-text showing all included topics.
2. **Improved styling**: Dark gradient header, colored left borders on cards, better typography, hover effects, modern feel.
3. **Reduced overwhelm**: Target ~30% of original checkbox count while keeping ALL topics visible.

## CLUSTERING FORMAT

### Before (overwhelming — 9 equal-weight checkboxes):
```
☐ Linear regression
☐ Polynomial regression
☐ Ridge
☐ Lasso
☐ Elastic Net
☐ Logistic regression
☐ kNN
☐ Naive Bayes
☐ SVM
```

### After (clustered — 2 checkboxes, same content):
```
☐ Regression Models
  Linear · Polynomial · Ridge · Lasso · Elastic Net

☐ Classification Models
  Logistic regression · kNN · Naive Bayes · SVM
```

### Clustering HTML Pattern
```html
<label class="item">
    <input type="checkbox" id="s1-1">
    <span class="check"></span>
    <div class="item-content">
        <div class="cluster-title">Regression Models</div>
        <div class="cluster-detail">Linear · Polynomial · Ridge · Lasso · Elastic Net</div>
    </div>
</label>
```

### Clustering Rules
1. Group 2-8 closely related sub-topics that are naturally learned together
2. Give each cluster a clear, descriptive title
3. Show sub-topics as middle-dot (·) separated gray text below the title
4. Single critical topics can remain standalone (no detail text needed)
5. Target: reduce each section's items to ~30-40% of original count
6. NEVER drop any topic — everything must appear either as a cluster title or in cluster detail text

## COMPLETE CSS

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root {
    --bg: #f1f5f9;
    --card: #ffffff;
    --text: #0f172a;
    --text-mid: #334155;
    --text-muted: #64748b;
    --text-light: #94a3b8;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
    --shadow: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
    --shadow-hover: 0 8px 25px rgba(0,0,0,0.08);

    /* Priority accent colors */
    --vh-accent: #ef4444; --vh-bg: #fef2f2; --vh-text: #991b1b; --vh-light: #fca5a5;
    --h-accent: #f59e0b; --h-bg: #fffbeb; --h-text: #92400e; --h-light: #fcd34d;
    --mh-accent: #06b6d4; --mh-bg: #ecfeff; --mh-text: #155e75; --mh-light: #67e8f9;
    --m-accent: #10b981; --m-bg: #ecfdf5; --m-text: #065f46; --m-light: #6ee7b7;
    --b-accent: #6366f1; --b-bg: #eef2ff; --b-text: #3730a3; --b-light: #a5b4fc;
    --lit-accent: #a855f7; --lit-bg: #faf5ff; --lit-text: #6b21a8; --lit-light: #c084fc;
    --special-accent: #ec4899; --special-bg: #fdf2f8; --special-text: #9d174d;

    /* HLD/LLD badges */
    --hld-accent: #14b8a6; --hld-bg: #f0fdfa; --hld-text: #115e59;
    --lld-accent: #8b5cf6; --lld-bg: #f5f3ff; --lld-text: #5b21b6;
    --ai-accent: #3b82f6; --ai-bg: #eff6ff; --ai-text: #1e40af;
    --p0-accent: #ef4444; --p0-bg: #fef2f2; --p0-text: #991b1b;
    --p1-accent: #f59e0b; --p1-bg: #fffbeb; --p1-text: #92400e;
    --p2-accent: #94a3b8; --p2-bg: #f8fafc; --p2-text: #475569;

    /* DSA difficulty */
    --easy-accent: #22c55e; --easy-bg: #f0fdf4; --easy-text: #166534;
    --med-accent: #f59e0b; --med-bg: #fffbeb; --med-text: #92400e;
    --hard-accent: #ef4444; --hard-bg: #fef2f2; --hard-text: #991b1b;

    --check-done: #22c55e;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    background: var(--bg);
    color: var(--text);
    padding: 20px;
    line-height: 1.5;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
}

/* ===== NAVIGATION ===== */
.nav {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
    font-size: 12px;
}
.nav a {
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: white;
    font-weight: 500;
    transition: all 0.15s ease;
}
.nav a.active {
    background: var(--text);
    color: white;
    border-color: var(--text);
}
.nav a:hover:not(.active) { background: var(--border-light); border-color: #cbd5e1; }

/* ===== DARK GRADIENT HEADER ===== */
.page-header {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    color: white;
    padding: 28px 30px 24px;
    border-radius: 14px;
    margin-bottom: 22px;
    position: relative;
    overflow: hidden;
}
.page-header::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 100%);
    pointer-events: none;
}
.page-header h1 {
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 20px;
    text-transform: uppercase;
    margin-bottom: 6px;
    color: #f1f5f9;
}
.page-header .subtitle {
    font-size: 12px;
    color: #94a3b8;
    max-width: 650px;
    line-height: 1.6;
    margin-bottom: 0;
}
.page-header .roles {
    font-size: 10px;
    color: #64748b;
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.overall-progress {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
}
.overall-bar {
    width: 200px;
    height: 6px;
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
    overflow: hidden;
}
.overall-bar .fill {
    height: 100%;
    background: linear-gradient(90deg, #22c55e, #4ade80);
    border-radius: 4px;
    transition: width 0.4s ease;
    width: 0%;
}
#overall-text {
    font-size: 13px;
    font-weight: 600;
    color: #cbd5e1;
    font-variant-numeric: tabular-nums;
}
.reset-btn {
    font-size: 10px;
    padding: 4px 12px;
    border: 1px solid rgba(239,68,68,0.4);
    color: #fca5a5;
    background: rgba(239,68,68,0.1);
    border-radius: 5px;
    cursor: pointer;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.15s;
}
.reset-btn:hover { background: rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.6); }

/* ===== MASONRY GRID ===== */
.masonry-grid {
    column-count: 3;
    column-gap: 16px;
}

/* ===== CARDS WITH LEFT BORDER ===== */
.card {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 4px solid var(--border);
    border-radius: 10px;
    padding: 16px 16px 12px;
    margin-bottom: 16px;
    break-inside: avoid;
    box-shadow: var(--shadow);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.card:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-1px);
}
/* Card accent borders by priority */
.card.vh { border-left-color: var(--vh-accent); }
.card.h { border-left-color: var(--h-accent); }
.card.mh { border-left-color: var(--mh-accent); }
.card.m { border-left-color: var(--m-accent); }
.card.b { border-left-color: var(--b-accent); }
.card.lit { border-left-color: var(--lit-accent); }
.card.special { border-left-color: var(--special-accent); }
.card.hld { border-left-color: var(--hld-accent); }
.card.lld { border-left-color: var(--lld-accent); }
.card.ai-hld { border-left-color: var(--ai-accent); }
.card.p0 { border-left-color: var(--p0-accent); }
.card.p1 { border-left-color: var(--p1-accent); }
.card.p2 { border-left-color: var(--p2-accent); }

/* Card header */
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 8px;
    margin-bottom: 4px;
    border-bottom: 1px solid var(--border-light);
    gap: 8px;
}
.card-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.3;
    letter-spacing: -0.01em;
}
.card-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}
.progress-text {
    font-size: 11px;
    color: var(--text-light);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}

/* Badges — pill-shaped, more visible */
.badge {
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    text-transform: uppercase;
    white-space: nowrap;
    letter-spacing: 0.4px;
}
.badge.vh { background: var(--vh-bg); color: var(--vh-text); }
.badge.h { background: var(--h-bg); color: var(--h-text); }
.badge.mh { background: var(--mh-bg); color: var(--mh-text); }
.badge.m { background: var(--m-bg); color: var(--m-text); }
.badge.b { background: var(--b-bg); color: var(--b-text); }
.badge.lit { background: var(--lit-bg); color: var(--lit-text); }
.badge.special { background: var(--special-bg); color: var(--special-text); }
.badge.hld { background: var(--hld-bg); color: var(--hld-text); }
.badge.lld { background: var(--lld-bg); color: var(--lld-text); }
.badge.ai-hld { background: var(--ai-bg); color: var(--ai-text); }
.badge.p0 { background: var(--p0-bg); color: var(--p0-text); }
.badge.p1 { background: var(--p1-bg); color: var(--p1-text); }
.badge.p2 { background: var(--p2-bg); color: var(--p2-text); }
.badge.easy { background: var(--easy-bg); color: var(--easy-text); }
.badge.med { background: var(--med-bg); color: var(--med-text); }
.badge.hard { background: var(--hard-bg); color: var(--hard-text); }

/* Card progress bar */
.card-progress {
    height: 3px;
    background: var(--border-light);
    border-radius: 2px;
    margin: 6px 0 10px;
    overflow: hidden;
}
.card-progress .fill {
    height: 100%;
    background: var(--check-done);
    border-radius: 2px;
    transition: width 0.4s ease;
    width: 0%;
}

/* Section group titles */
.list-group-title {
    font-size: 10px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    margin: 14px 0 6px;
    letter-spacing: 0.5px;
}
.card-body > .list-group-title:first-child { margin-top: 4px; }

/* ===== CLUSTERED CHECKBOX ITEMS ===== */
.item {
    display: flex;
    align-items: flex-start;
    padding: 5px 0;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    border-radius: 6px;
    margin: 0 -4px;
    padding-left: 4px;
    padding-right: 4px;
    transition: background 0.1s;
}
.item:hover { background: var(--border-light); }
.item input[type="checkbox"] {
    position: absolute;
    opacity: 0;
    width: 0; height: 0;
}
.item .check {
    width: 16px;
    height: 16px;
    border: 2px solid #cbd5e1;
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 1px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}
.item:hover .check { border-color: #94a3b8; }
.item input:checked + .check {
    background: var(--check-done);
    border-color: var(--check-done);
    animation: checkPop 0.2s ease;
}
@keyframes checkPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
}
.item input:checked + .check::after {
    content: '✓';
    color: white;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
}
.item input:checked ~ .item-content .cluster-title {
    color: #94a3b8;
    text-decoration: line-through;
}
.item input:checked ~ .item-content .cluster-detail {
    color: #cbd5e1;
}
/* For simple items without clustering (DSA problems, etc.) */
.item input:checked ~ .item-text {
    text-decoration: line-through;
    color: #b0b0b0;
}

.item-content {
    flex: 1;
    min-width: 0;
}
.cluster-title {
    font-weight: 600;
    font-size: 12px;
    color: var(--text-mid);
    line-height: 1.4;
    transition: color 0.2s;
}
.cluster-detail {
    font-size: 11px;
    color: var(--text-light);
    line-height: 1.4;
    margin-top: 1px;
    transition: color 0.2s;
}
.item-text {
    font-size: 12px;
    color: var(--text-mid);
    line-height: 1.4;
    flex: 1;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1100px) {
    .masonry-grid { column-count: 2; }
}
@media (max-width: 700px) {
    body { padding: 10px; }
    .masonry-grid { column-count: 1; }
    .page-header { padding: 20px 18px; border-radius: 10px; }
    .page-header h1 { font-size: 15px; letter-spacing: 1px; }
    .page-header .subtitle { font-size: 11px; }
    .item {
        padding: 7px 4px;
    }
    .item .check {
        width: 22px;
        height: 22px;
        margin-right: 12px;
        margin-top: 0;
    }
    .item input:checked + .check::after { font-size: 13px; }
    .cluster-title { font-size: 13px; }
    .cluster-detail { font-size: 12px; }
    .card { padding: 14px; border-radius: 8px; }
    .card-title { font-size: 14px; }
    .list-group-title { font-size: 11px; margin: 16px 0 8px; }
    .badge { font-size: 9px; padding: 3px 8px; }
    .nav { gap: 4px; }
    .nav a { padding: 7px 10px; font-size: 11px; }
    .overall-bar { width: 120px; }
}

/* ===== PRINT ===== */
@media print {
    body { padding: 10px; background: white; }
    .nav, .reset-btn, .overall-progress { display: none !important; }
    .page-header { background: none !important; color: black; border: 2px solid black; padding: 12px; }
    .page-header h1 { color: black; }
    .page-header .subtitle, .page-header .roles { color: #555; }
    .masonry-grid { column-count: 3; column-gap: 10px; }
    .card {
        box-shadow: none;
        break-inside: avoid;
        page-break-inside: avoid;
        border: 1px solid #ccc;
        padding: 8px;
        margin-bottom: 8px;
    }
    .card:hover { transform: none; box-shadow: none; }
    .item .check, .badge {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
    .card-progress { display: none; }
    .item { font-size: 9px; padding: 1.5px 0; }
    .cluster-title { font-size: 9px; }
    .cluster-detail { font-size: 8px; }
    .card-title { font-size: 10px; }
    .list-group-title { font-size: 8px; margin: 4px 0 2px; }
}

/* ===== TABS (HLD/LLD page) ===== */
.tabs {
    display: flex;
    justify-content: center;
    gap: 0;
    margin-bottom: 22px;
}
.tab-btn {
    padding: 10px 24px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid var(--border);
    background: white;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    transition: all 0.15s ease;
    font-family: inherit;
}
.tab-btn:first-child { border-radius: 8px 0 0 8px; }
.tab-btn:last-child { border-radius: 0 8px 8px 0; }
.tab-btn:not(:first-child) { border-left: none; }
.tab-btn.active {
    background: var(--text);
    color: white;
    border-color: var(--text);
}
.tab-btn:hover:not(.active) { background: var(--border-light); }
.tab-content { display: none; }
.tab-content.active { display: block; }
@media print { .tabs { display: none; } .tab-content { display: block !important; } }
@media (max-width: 700px) {
    .tab-btn { padding: 9px 12px; font-size: 10px; letter-spacing: 0.3px; }
}

/* ===== DSA SPECIFIC ===== */
.difficulty-section {
    margin: 8px 0 6px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 6px;
}
.difficulty-section .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
}
.difficulty-section.easy .dot { background: var(--easy-accent); }
.difficulty-section.easy { color: var(--easy-text); }
.difficulty-section.med .dot { background: var(--med-accent); }
.difficulty-section.med { color: var(--med-text); }
.difficulty-section.hard .dot { background: var(--hard-accent); }
.difficulty-section.hard { color: var(--hard-text); }
.item .problem-link {
    color: var(--text-light);
    font-size: 10px;
    font-weight: 500;
    margin-left: auto;
    padding-left: 8px;
    text-decoration: none;
    flex-shrink: 0;
}
.item .problem-link:hover { color: var(--text-muted); text-decoration: underline; }
```

## JAVASCRIPT TEMPLATE

Replace `PAGE_KEY` with the page-specific key.

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

    // Tab switching (for pages with tabs)
    window.switchTab = function(name) {
        document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        var tab = document.getElementById('tab-' + name);
        var btn = document.querySelector('[data-tab="' + name + '"]');
        if (tab) tab.classList.add('active');
        if (btn) btn.classList.add('active');
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

## HTML STRUCTURE

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PAGE TITLE</title>
<style>/* FULL CSS */</style>
</head>
<body>
<nav class="nav">
    <a href="ai-swe-scope.html">AI/SWE Scope</a>
    <a href="core-ml-scope.html">Core ML</a>
    <a href="hld-lld-tracker.html">HLD & LLD</a>
    <a href="dsa-tracker.html">DSA Practice</a>
</nav>
<div class="page-header">
    <h1>PAGE TITLE</h1>
    <p class="subtitle">PAGE SUBTITLE</p>
    <p class="roles">TARGET ROLES (if applicable)</p>
    <div class="overall-progress">
        <div class="overall-bar"><div class="fill" id="overall-fill"></div></div>
        <span id="overall-text">0 / 0 (0%)</span>
        <button class="reset-btn" onclick="resetAll()">Reset All</button>
    </div>
</div>
<!-- TABS (if applicable) -->
<div class="masonry-grid">
    <!-- CARDS -->
</div>
<script>/* FULL JS */</script>
</body>
</html>
```

## CARD PATTERN (Clustered)
```html
<div class="card vh">
    <div class="card-header">
        <h3 class="card-title">1. Software Engineering</h3>
        <div class="card-meta">
            <span class="progress-text">0/9</span>
            <span class="badge vh">Very High</span>
        </div>
    </div>
    <div class="card-progress"><div class="fill"></div></div>
    <div class="card-body">
        <div class="list-group-title">Backend</div>
        <label class="item">
            <input type="checkbox" id="s1-1">
            <span class="check"></span>
            <div class="item-content">
                <div class="cluster-title">Core Backend Stack</div>
                <div class="cluster-detail">Python · APIs · REST · gRPC</div>
            </div>
        </label>
        <label class="item">
            <input type="checkbox" id="s1-2">
            <span class="check"></span>
            <div class="item-content">
                <div class="cluster-title">Architecture Patterns</div>
                <div class="cluster-detail">Microservices · Event-driven · Queues · Caching</div>
            </div>
        </label>
    </div>
</div>
```

## CARD PATTERN (DSA — no clustering, individual problems)
```html
<div class="card m">
    <div class="card-header">
        <h3 class="card-title">Arrays & Hashing</h3>
        <div class="card-meta">
            <span class="progress-text">0/20</span>
        </div>
    </div>
    <div class="card-progress"><div class="fill"></div></div>
    <div class="card-body">
        <div class="difficulty-section easy"><span class="dot"></span>Easy</div>
        <label class="item">
            <input type="checkbox" id="ah-1">
            <span class="check"></span>
            <span class="item-text">Two Sum</span>
            <a class="problem-link" href="https://leetcode.com/problems/two-sum/" target="_blank">LC 1</a>
        </label>
    </div>
</div>
```

## NAVIGATION LINKS
All pages must include nav links to all 4 pages:
- `ai-swe-scope.html` → "AI/SWE Scope"
- `core-ml-scope.html` → "Core ML"
- `hld-lld-tracker.html` → "HLD & LLD"
- `dsa-tracker.html` → "DSA Practice"

## CRITICAL RULES
1. ALL topics must appear — either as cluster titles or in cluster detail text
2. Clustering reduces checkboxes, NOT content
3. Each checkbox needs a unique ID
4. Progress-text shows 0/TOTAL based on actual checkbox count
5. File must work in browser with no server or build tools
6. Add the card's priority class to the `<div class="card X">` element for the colored left border
7. The `@import` Google Fonts line is optional — if it causes issues, use the system font stack as fallback
