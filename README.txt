Éclorege — Hero video correction only

This patch contains only the files changed for the homepage hero video:
- index.html
- styles.css
- assets/hero-video.mp4
- assets/hero-poster.jpg

To apply:
1. Unzip this patch.
2. Upload/replace these files at the same relative paths in the ROOT of the existing GitHub repository.
3. Ensure index.html and styles.css stay in the repository root, and both video files are inside assets/.
4. Commit changes, wait for GitHub Pages to deploy, then hard refresh with Ctrl+F5.

The video is configured to autoplay muted, loop, and play inline. Some browsers may still block autoplay; the poster is used as a fallback.
