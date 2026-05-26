#!/usr/bin/env bash
# PostToolUse hook: roda `next lint` no arquivo editado.
# Exit 2 + stderr => Claude vê erro e conserta antes do próximo passo.

set -u

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')

case "$file" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" || exit 0

# Caminho relativo (next lint exige path dentro do projeto)
rel="${file#${CLAUDE_PROJECT_DIR:-$(pwd)}/}"

output=$(npx --no-install next lint --file "$rel" --quiet 2>&1)
status=$?

if [ $status -ne 0 ]; then
  printf 'next lint falhou em %s:\n%s\n' "$rel" "$output" >&2
  exit 2
fi

exit 0
