import re
import glob

html_files = glob.glob('*.html')

pwa_head = """
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#0f172a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="K-Tracker">
</head>
"""

sw_register = """
<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
</script>
</body>
"""

new_mobile_nav = """@media (max-width: 600px) {
    body {
        padding-bottom: 70px;
    }
    .nav {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: #ffffff;
        border-top: 1px solid #e2e8f0;
        z-index: 1000;
        padding: 12px 10px;
        box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        margin-bottom: 0;
    }
    .nav::-webkit-scrollbar { display: none; }
    .nav a {
        white-space: nowrap;
        flex-shrink: 0;
        border: none;
        background: transparent;
        padding: 8px 12px;
        font-size: 13px;
    }
    .nav a.active {
        background: #0f172a;
        color: white;
    }
}"""

for file in html_files:
    with open(file, 'r') as f:
        html = f.read()

    # 1. Inject PWA meta tags
    if '<link rel="manifest"' not in html:
        html = html.replace('</head>', pwa_head)

    # 2. Inject SW register (only index.html really needs to register it, but adding to all is safe and standard)
    if 'navigator.serviceWorker.register' not in html:
        html = html.replace('</body>', sw_register)

    # 3. Replace mobile nav CSS
    if file != 'index.html':
        # Find the exact old @media (max-width: 600px) block for nav
        old_mobile_regex = r"@media \(max-width: 600px\) \{[\s\S]*?\}\s*\}"
        if re.search(old_mobile_regex, html):
            html = re.sub(old_mobile_regex, new_mobile_nav, html)

    with open(file, 'w') as f:
        f.write(html)
