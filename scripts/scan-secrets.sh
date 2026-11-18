#!/bin/bash
# ============================================================
# The New Me - repository secret scanner
# Usage: ./scripts/scan-secrets.sh
# Exits non-zero if a likely credential is found in tracked files.
# Patterns cover GitHub PATs (classic/fine-grained/OAuth), generic
# API keys, AWS, Slack, private keys. CSS "mask-image" is whitelisted.
# ============================================================
set -u

cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

PATTERNS=(
  'ghp_[A-Za-z0-9]{36,}'
  'ghs_[A-Za-z0-9]{36,}'
  'github_pat_[A-Za-z0-9_]{20,}'
  'gho_[A-Za-z0-9]{36,}'
  'ghu_[A-Za-z0-9]{36,}'
  'sk-[A-Za-z0-9]{20,}'
  'sk_live_[A-Za-z0-9]{20,}'
  'AIza[0-9A-Za-z_-]{20,}'
  'AKIA[0-9A-Z]{16}'
  'xox[baprs]-[A-Za-z0-9-]{10,}'
  '-----BEGIN [A-Z ]+PRIVATE KEY-----'
  'AKIA[0-9A-Z]{16}'
)

FILES="$(git ls-files)"
HITS=0

for pat in "${PATTERNS[@]}"; do
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    # Whitelist CSS mask-image false positives
    echo "$line" | grep -q 'mask-image' && continue
    # Whitelist the documented placeholder template (.env.example)
    echo "$line" | grep -q '^\.env\.example:' && continue
    echo "⚠️  Possible secret in: $line"
    HITS=1
  done < <(git grep -nE -- "$pat" -- ${FILES} 2>/dev/null)
done

if [ "$HITS" -eq 0 ]; then
  echo "✅ No secrets found in tracked files."
  exit 0
fi
echo "❌ Review flagged lines above before committing."
exit 1
