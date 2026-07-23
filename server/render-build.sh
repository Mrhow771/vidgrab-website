#!/usr/bin/env bash

# Exit on error
set -o errexit

echo "=== Starting Render Build Script ==="

# Create bin directory
mkdir -p bin

# Rebuild sqlite3 from source to fix GLIBC version mismatch on Render
echo "Rebuilding sqlite3 from source..."
npm rebuild sqlite3 --build-from-source

# 1. Download yt-dlp static binary
echo "Downloading yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod +x bin/yt-dlp

# 2. Download ffmpeg/ffprobe static binaries
echo "Downloading ffmpeg amd64 static release..."
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz

echo "Extracting ffmpeg..."
tar -xf ffmpeg.tar.xz
# Find the extracted folder name
FFMPEG_DIR=$(find . -maxdepth 1 -type d -name "ffmpeg-*-amd64-static")

# Move binaries to bin/
mv "$FFMPEG_DIR/ffmpeg" bin/
mv "$FFMPEG_DIR/ffprobe" bin/

# Cleanup
rm -rf ffmpeg.tar.xz "$FFMPEG_DIR"

# Ensure all binaries are executable
chmod +x bin/yt-dlp bin/ffmpeg bin/ffprobe

echo "=== Render Build Script Completed Successfully ==="
