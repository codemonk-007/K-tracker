import re
from collections import defaultdict

with open("dsa-tracker.html", "r", encoding="utf-8") as f:
    html = f.read()

labels = html.split('<label class="item">')

url_to_labels = defaultdict(list)

for idx, label in enumerate(labels[1:]):
    match = re.search(r'href="([^"]+)"', label)
    if match:
        url = match.group(1)
        url_to_labels[url].append((idx, label))

duplicates = {url: lst for url, lst in url_to_labels.items() if len(lst) > 1}

for url, lst in duplicates.items():
    print(f"\nDuplicate URL: {url}")
    for idx, label in lst:
        id_match = re.search(r'id="(p-\d+)"', label)
        cb_id = id_match.group(1) if id_match else "unknown"
        text_match = re.search(r'<span class="item-text">([^<]+)</span>', label)
        text = text_match.group(1) if text_match else "unknown"
        print(f"  ID: {cb_id}, Text: {text}")

