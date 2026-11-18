#!/bin/bash
# Install git hooks for The New Me repo.
#   - pre-commit: runs scripts/scan-secrets.sh and blocks commits with secrets.
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

HOOK=".git/hooks/pre-commit"
mkdir -p .git/hooks
cat > "$HOOK" <<'HOOKEOF'
#!/bin/bash
set -u
cd "$(git rev-parse --show-toplevel)"
exec bash scripts/scan-secrets.sh
HOOKEOF
chmod +x "$HOOK"
echo "✅ Installed pre-commit secret-scan hook."
