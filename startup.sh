#!/bin/sh
# Revive the preview. Idempotent: exit if port 8080 is already serving.
set -e
cd /workspace
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
