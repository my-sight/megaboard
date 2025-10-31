#!/usr/bin/env bash
set -euo pipefail

sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git cloudflared
sudo npm install -g pnpm

sudo mkdir -p /srv/mysight/app
sudo chown -R "$USER":"$USER" /srv/mysight

if ! id "web" &>/dev/null; then
  sudo useradd -r -s /usr/sbin/nologin web
fi

cat <<'UNIT' | sudo tee /etc/systemd/system/mysight-web.service >/dev/null
[Unit]
Description=mysight Next.js service
After=network.target

[Service]
Type=simple
User=web
WorkingDirectory=/srv/mysight/app
ExecStart=/usr/bin/npm run start -- --port 3000
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
UNIT

cat <<'UNIT' | sudo tee /etc/systemd/system/mysight-landing.service >/dev/null
[Unit]
Description=mysight Landing Static Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/mysight/www
ExecStart=/usr/bin/python3 -m http.server 8080
Restart=on-failure

[Install]
WantedBy=multi-user.target
UNIT

sudo mkdir -p /var/www/mysight/www
sudo systemctl daemon-reload
sudo systemctl enable mysight-web
sudo systemctl enable mysight-landing

sudo systemctl start mysight-web || true
sudo systemctl start mysight-landing || true

printf "Bootstrap abgeschlossen. Prüfe Dienste mit systemctl status mysight-web.\n"
