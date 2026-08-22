import re

with open("dsa-tracker.html", "r", encoding="utf-8") as f:
    html = f.read()

# The IDs of the duplicate problems to remove
duplicate_ids = [
    "p-118", "p-192", "p-196", "p-212", "p-211", "p-213", 
    "p-50", "p-102", "p-191", "p-156", "p-164"
]

for dup_id in duplicate_ids:
    # Pattern to match the label block containing the specific ID
    # Matches <label class="item"> ... id="p-XXX" ... </label> and trailing whitespace
    pattern = r'<label class="item">\s*<input type="checkbox" id="' + dup_id + r'">[\s\S]*?</label>\s*'
    html = re.sub(pattern, '', html)

with open("dsa-tracker.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"Removed {len(duplicate_ids)} duplicate problems.")
