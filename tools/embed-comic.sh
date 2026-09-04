#!/usr/bin/env bash
# Inline the comic sheet into OAHFcomic.html as a data: URI, so the page ships
# as a single self-contained file like index.html and OAHF.html do.
#
#   tools/embed-comic.sh [sheet] [page.html]
#
# Defaults: assets/oahf-comic.jpg -> OAHFcomic.html, edited in place.
# Re-running it is safe: the applySheet(...) call is rewritten each time.
set -euo pipefail

SHEET="${1:-assets/oahf-comic.jpg}"
PAGE="${2:-OAHFcomic.html}"

[ -f "$SHEET" ] || { echo "sheet not found: $SHEET" >&2; exit 1; }
[ -f "$PAGE" ]  || { echo "page not found: $PAGE"  >&2; exit 1; }

case "${SHEET,,}" in
  *.png)        MIME=image/png ;;
  *.jpg|*.jpeg) MIME=image/jpeg ;;
  *.webp)       MIME=image/webp ;;
  *.svg)        MIME=image/svg+xml ;;
  *) echo "unsupported sheet type: $SHEET" >&2; exit 1 ;;
esac

B64=$(base64 -w0 "$SHEET")
python3 - "$PAGE" "$MIME" "$B64" <<'PY'
import io, re, sys
page, mime, b64 = sys.argv[1], sys.argv[2], sys.argv[3]
src = io.open(page, encoding='utf-8').read()
new = "applySheet('data:%s;base64,%s');" % (mime, b64)
out, n = re.subn(r"applySheet\('[^']*'\);", new, src)
if n != 1:
    sys.exit("expected exactly one applySheet('...') call, found %d" % n)
io.open(page, 'w', encoding='utf-8').write(out)
PY

printf 'inlined %s (%s) into %s — now %s\n' \
  "$SHEET" "$(du -h "$SHEET" | cut -f1)" "$PAGE" "$(du -h "$PAGE" | cut -f1)"
