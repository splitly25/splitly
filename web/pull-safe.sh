#!/bin/bash
# pull-safe.sh - Safe git pull script

echo "🔄 Safe git pull starting..."

# Stash any local changes
if ! git diff-index --quiet HEAD --; then
    echo "📦 Stashing local changes..."
    git stash push -m "Auto-stash before pull $(date)"
    STASHED=true
else
    STASHED=false
fi

# Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull origin main

# Optionally restore stashed changes (uncomment if needed)
# if [ "$STASHED" = true ]; then
#     echo "📦 Restoring stashed changes..."
#     git stash pop
# fi

echo "✅ Pull completed successfully!"
echo "📋 Recent commits:"
git log --oneline -3