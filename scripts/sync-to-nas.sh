#!/bin/bash
set -e

# Configuration
NAS_MOUNT="/Volumes/kubernetes-pvs"
LOCAL_BUILD_DIR="$(cd "$(dirname "$0")/.." && pwd)/public"

echo "📦 Finding PVC path on NAS..."
cd "$(dirname "$0")/.."

# Check if NAS is mounted
if [ ! -d "$NAS_MOUNT" ]; then
  echo "❌ Error: NAS not mounted at $NAS_MOUNT"
  echo "   Please mount the 'kubernetes-pvs' share in Finder first."
  exit 1
fi

# Find the actual PVC directory
PVC_DIR=$(ls -d ${NAS_MOUNT}/dnd-player-site-dnd-content-pvc-*/ 2>/dev/null | head -1)

if [ -z "$PVC_DIR" ]; then
  echo "❌ Error: Could not find PVC directory at ${NAS_MOUNT}/dnd-player-site-dnd-content-pvc-*/"
  echo "   Make sure the PVC is created in Kubernetes first."
  exit 1
fi

echo "  Found PVC: $PVC_DIR"
echo "  Local:     $LOCAL_BUILD_DIR"
echo ""
echo "📤 Syncing built site to NAS..."

# Sync the built site to NAS
# --delete removes files on NAS that don't exist locally
# -av is archive mode with verbose output
rsync -avc --delete \
  --exclude='.DS_Store' \
  "$LOCAL_BUILD_DIR/" \
  "$PVC_DIR"

echo ""
echo "✅ Sync complete!"
echo "The site should update automatically in Kubernetes."
echo "Visit: https://dnd on your Tailscale network"
