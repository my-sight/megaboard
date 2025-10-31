#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/srv/mysight/app

if [ ! -d "$APP_DIR" ]; then
  echo "App Verzeichnis $APP_DIR existiert nicht" >&2
  exit 1
fi

cd "$APP_DIR"

git pull --ff-only
npm ci
npm run build
sudo systemctl restart mysight-web
curl -fsS http://localhost:3000/healthz
