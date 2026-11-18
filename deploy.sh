#!/bin/bash
set -e

# ============================================================
# The New Me - Deploy script (API-token based, zero embedded secrets)
# ============================================================
# Credentials are NEVER stored in this repo or in remote URLs.
# Auth flow (pick one):
#   1. GitHub CLI (recommended):  gh auth login
#   2. Env-injected API token:    export GH_TOKEN=github_pat_...  (fine-grained, repo-only scope)
# The script refuses to run if the remote URL contains embedded credentials.
# ============================================================

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "🚀 [The New Me] Preparing deployment from the_new_me_website..."

# --- 1. Remote must exist and be credential-free ---------------------------
REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
if [ -z "$REMOTE_URL" ]; then
  echo "⚠️  No git remote configured. Set one up (never embed a token in the URL):"
  echo "    gh auth login"
  echo "    git remote add origin git@github.com:<you>/<repo>.git"
  echo "    # or:  git remote add origin https://github.com/<you>/<repo>.git"
  exit 1
fi

if printf '%s' "$REMOTE_URL" | grep -qE 'https://[^@/]+@'; then
  echo "❌ Remote URL contains embedded credentials. THIS IS FORBIDDEN."
  echo "   Fix it:"
  echo "     git remote set-url origin https://github.com/<you>/<repo>.git"
  echo "     # then authenticate via:  gh auth login   (or GH_TOKEN env var)"
  exit 1
fi

# --- 2. Authenticate --------------------------------------------------------
if [ -n "${GH_TOKEN:-}" ] || [ -n "${GITHUB_TOKEN:-}" ]; then
  echo "🔐 Using API token from environment (GH_TOKEN/GITHUB_TOKEN)."
elif command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  echo "🔐 Using GitHub CLI auth (gh)."
else
  echo "⚠️  No credential source found. Authenticate first:"
  echo "    gh auth login"
  echo "    # or export an API token for one push:"
  echo "    export GH_TOKEN=github_pat_...  # fine-grained, repo scope only"
  exit 1
fi

# --- 3. Commit (if there are changes) --------------------------------------
CHANGES="$(git status --porcelain)"
if [ -z "$CHANGES" ]; then
  echo "✅ No changes to commit. Working tree clean."
else
  echo "📦 Staging changed files..."
  git add .
  COMMIT_MSG="${1:-chore: update site content and assets $(date '+%Y-%m-%d %H:%M:%S')}"
  git commit -m "$COMMIT_MSG"
  echo "✅ Changes committed: $COMMIT_MSG"
fi

# --- 4. Push (credentials come from gh/GH_TOKEN, never from the URL) -------
git push -u origin main
echo "🎉 Push successful! Platform build will start automatically."
