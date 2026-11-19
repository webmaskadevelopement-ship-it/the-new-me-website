#!/usr/bin/env python3
"""
Clean Mac Ghost Files & Resource Forks
Safely deletes ._* (AppleDouble), .DS_Store, and Windows Thumbs.db files.
"""
import os
import sys

def clean(target_dir):
    deleted = 0
    errors = 0
    for root, dirs, files in os.walk(target_dir, topdown=False):
        for f in files:
            if f.startswith('._') or f == '.DS_Store' or f == 'Thumbs.db':
                p = os.path.join(root, f)
                try:
                    os.remove(p)
                    deleted += 1
                except Exception:
                    errors += 1
        for d in dirs:
            if d.startswith('._') or d == '.DS_Store':
                p = os.path.join(root, d)
                try:
                    os.rmdir(p)
                    deleted += 1
                except Exception:
                    errors += 1
    print(f"Purged {deleted} ghost system files from {target_dir}. Errors: {errors}")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    clean(target)
