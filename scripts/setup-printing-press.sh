#!/usr/bin/env bash
# Set up the Printing Press CLI factory and starter-pack on this machine.
#
#   https://printingpress.dev
#   https://github.com/mvanhorn/cli-printing-press
#   https://github.com/mvanhorn/printing-press-library
#
# Installs:
#   - printing-press factory binary  -> $(go env GOPATH)/bin/printing-press
#   - Claude Code skills             -> ~/.claude/skills/printing-press*
#   - starter-pack CLIs + skills     -> $(go env GOPATH)/bin/<api>-pp-cli
#                                       and ~/.claude/skills/pp-<api>
#
# Re-running is safe: go install upgrades in place; the npx installers no-op
# on already-installed skills/CLIs.

set -euo pipefail

REQUIRED_GO_MIN="1.26.3"

log()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m  %s\n' "$*" >&2; }
die()  { printf '\033[1;31mxx\033[0m  %s\n' "$*" >&2; exit 1; }

ver_ge() {
  # ver_ge A B -> exit 0 iff A >= B (semver-ish, dot-separated numbers)
  [ "$(printf '%s\n%s\n' "$1" "$2" | sort -V | head -n1)" = "$2" ]
}

# --- 1. Prereqs -------------------------------------------------------------

command -v go >/dev/null   || die "go not found. Install Go ${REQUIRED_GO_MIN}+ from https://go.dev/dl/"
command -v npx >/dev/null  || die "npx not found. Install Node.js 20+."
command -v claude >/dev/null || warn "claude (Claude Code) not on PATH — skills will install but won't be discoverable until Claude Code is set up."

GO_VERSION="$(go env GOVERSION 2>/dev/null | sed 's/^go//')"
[ -n "$GO_VERSION" ] || die "could not read go version"

if ! ver_ge "$GO_VERSION" "$REQUIRED_GO_MIN"; then
  warn "Go ${GO_VERSION} is older than ${REQUIRED_GO_MIN}; relying on GOTOOLCHAIN=auto to fetch a newer toolchain on demand."
  export GOTOOLCHAIN=auto
fi

GOBIN="$(go env GOBIN)"
[ -n "$GOBIN" ] || GOBIN="$(go env GOPATH)/bin"
case ":$PATH:" in
  *":$GOBIN:"*) ;;
  *) warn "$GOBIN is not on \$PATH. Add: export PATH=\"\$PATH:$GOBIN\"" ;;
esac

# --- 2. Factory binary ------------------------------------------------------

log "Installing printing-press factory binary"
go install github.com/mvanhorn/cli-printing-press/v4/cmd/printing-press@latest
"$GOBIN/printing-press" --version

# --- 3. Factory skills (meta-skills under ~/.claude/skills/printing-press*) -

log "Installing Printing Press Claude Code skills"
npx -y skills add mvanhorn/cli-printing-press/skills -g -a claude-code -y

# --- 4. Starter-pack CLIs + skills from the library hub ---------------------

log "Installing starter-pack from the printing-press-library hub"
npx -y @mvanhorn/printing-press install starter-pack

# --- 5. Done ----------------------------------------------------------------

log "Done."
cat <<'EOF'

Next steps:
  - Open Claude Code and try one of the slash commands:
      /printing-press <api-name-or-url>
      /printing-press-catalog
  - Browse the public library:
      npx -y @mvanhorn/printing-press list
      npx -y @mvanhorn/printing-press search <keyword>
  - Install more CLIs individually:
      npx -y @mvanhorn/printing-press install <api>
EOF
