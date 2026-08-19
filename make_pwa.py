import os

manifest_content = """{
  "name": "K-Tracker",
  "short_name": "Tracker",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#0f172a",
  "icons": [
    {
      "src": "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%230f172a%22/><text y=%2260%22 x=%2235%22 font-size=%2240%22 fill=%22white%22 font-family=%22sans-serif%22>K</text></svg>",
      "sizes": "192x192 512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}"""

sw_content = """// Basic Service Worker to pass PWA requirements
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // We don't intercept fetch because GistSync handles our cloud logic
  // and GH pages caches our static files natively.
});
"""

with open('manifest.json', 'w') as f:
    f.write(manifest_content)

with open('sw.js', 'w') as f:
    f.write(sw_content)
