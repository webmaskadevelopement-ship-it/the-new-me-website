#!/usr/bin/env python3
"""Serial, atomic WebP re-compression @q85/method6. Idempotent.
Skips unreadable files; writes via temp + os.replace."""
import os, sys, io, tempfile
from PIL import Image

ROOT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else ".")
QUALITY = 85
MIN_KEEP = 8192          # skip tiny files (no meaningful gains)
KEEP_RATIO = 1.02

def encode(path):
    old = os.path.getsize(path)
    if old < MIN_KEEP:
        return None
    with Image.open(path) as im:
        im.load()
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=QUALITY, method=6)
    new = buf.getvalue()
    if len(new) > old * KEEP_RATIO:
        return None
    fd, tmp = tempfile.mkstemp(dir=os.path.dirname(path), suffix=".tmp")
    try:
        with os.fdopen(fd, "wb") as f:
            f.write(new)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)
    return old - len(new)

def main():
    targets = []
    for base in ("frames", "DATA", "images"):
        for dp, _d, files in os.walk(os.path.join(ROOT, base)):
            for fn in files:
                if fn.lower().endswith(".webp"):
                    targets.append(os.path.join(dp, fn))
    saved = 0; skipped = 0; errors = 0
    for i, path in enumerate(targets, 1):
        try:
            r = encode(path)
            if r is None:
                skipped += 1
            else:
                saved += r
        except Exception as e:
            errors += 1
            print(f"  ERR {path}: {e}", file=sys.stderr)
        if i % 250 == 0:
            print(f"  progress {i}/{len(targets)} saved={saved/1024/1024:.2f}MB")
    print(f"Done. saved={saved/1024/1024:.2f}MB skipped(keep-original)={skipped} errors={errors}")

if __name__ == "__main__":
    main()
