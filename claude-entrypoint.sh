#!/bin/sh
set -e

CONFIG="/root/.claude.json"
BACKUP_DIR="/root/.claude/backups"

if [ ! -f "$CONFIG" ]; then
  latest_backup=$(ls -t "$BACKUP_DIR"/.claude.json.backup.* 2>/dev/null | head -1)
  if [ -n "$latest_backup" ]; then
    cp "$latest_backup" "$CONFIG"
    echo "Auto-restored config from $latest_backup"
  fi
fi

exec "$@"
