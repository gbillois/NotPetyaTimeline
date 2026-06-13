#!/bin/zsh
# Final assembly: PNG frames + mixed audio → H.264 MP4 (1080p24, AAC)
set -e
cd "$(dirname "$0")"
/opt/homebrew/bin/ffmpeg -y \
  -framerate 24 -i frames/f%05d.png \
  -i mix.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k \
  -movflags +faststart -shortest \
  ../notpetya-documentary.mp4
/opt/homebrew/bin/ffprobe -v error -show_entries format=duration,size -of default=noprint_wrappers=1 ../notpetya-documentary.mp4
