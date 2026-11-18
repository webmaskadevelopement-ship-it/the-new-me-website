#!/bin/bash
set -e

# The New Me - Automated deploy script (Netlify/Vercel auto-build on push)
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "🚀 [The New Me] Preparing deployment from the_new_me_website..."

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "⚠️  No git remote configured. Add one first (never embed a token in the URL):"
  echo "    gh auth login && git remote add origin git@github.com:<you>/<repo>.git"
  exit 1
fi

CHANGES=$(git status --porcelain)
if [ -z "$CHANGES" ]; then
  echo "✅ No changes to commit. Working tree clean."
else
  echo "📦 Staging changed files..."
  git add .
  COMMIT_MSG="${1:-chore: update site content and assets $(date '+%Y-%m-%d %H:%M:%S')}"
  git commit -m "$COMMIT_MSG"
  echo "✅ Changes committed: $COMMIT_MSG"
fi

git push -u origin main
echo "🎉 Push successful! Platform build will start automatically."
