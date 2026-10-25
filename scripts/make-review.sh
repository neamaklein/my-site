#!/bin/sh
# Build the claude.ai review copy into review-build/: hash routing,
# relative paths, page body only. Publish review-build/index.html to the
# review artifact with review-build/ as root.
set -e
cd "$(dirname "$0")/.."
OUT=review-build
rm -rf $OUT
VITE_ROUTER=hash npx vite build --base ./ --outDir $OUT --emptyOutDir >/dev/null
rm -f $OUT/404.html
python3 - "$OUT/index.html" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
head = re.search(r'<head>(.*)</head>', s, re.S).group(1)
head = re.sub(r'\s*<meta charset[^>]*>\s*|\s*<meta name="viewport"[^>]*>\s*', '\n', head)
head = head.replace('<title>Neama Klein — Portfolio</title>', '<title>Neama Klein Portfolio</title>')
open(p, 'w').write(head.strip() + '\n<div id="root"></div>\n')
PY
# The artifact caps files at 15 MB: swap in the lighter 720p walkthrough.
# Same for the home film: a lighter 1080p copy (keyframe every second,
# 2.45 Mb/s), since the site's one is over the cap.
for f in $OUT/assets/film-1080-*.mp4; do
  [ -f "$f" ] && cp scripts/review/film-review.mp4 "$f"
done
# The vertical HEVC film (11 MB) stays, but is the lighter H.264 one there.
for f in $OUT/assets/film-mobile-hevc-*.mp4; do
  [ -f "$f" ] && cp scripts/review/film-mobile-review.mp4 "$f"
done
for f in $OUT/assets/walkthrough-*.mp4; do
  [ -f "$f" ] && cp scripts/review/walkthrough-review.mp4 "$f"
done
echo "Review copy built in $OUT/"
