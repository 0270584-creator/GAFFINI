#!/bin/bash
# Double-click this file to preview the Gaffini site locally.
cd "$(dirname "$0")" || exit 1
PORT=8000
while lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do PORT=$((PORT+1)); done
echo ""
echo "  Gaffini preview running at  http://localhost:$PORT"
echo "  Keep this window open. Press Ctrl+C to stop."
echo ""
(sleep 1; open "http://localhost:$PORT") &
python3 -m http.server $PORT --bind 127.0.0.1
