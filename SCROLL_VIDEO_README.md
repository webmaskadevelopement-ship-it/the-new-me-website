# Scroll Video Setup for The New Me (TNM WEBSITE)

This directory contains everything required to build smooth, high-frame-rate scroll-scrubbed videos using GSAP and HTML5 Canvas / Video.

---

## 📁 Files Cloned & Created

| Path | Purpose |
|---|---|
| `vendor/gsap/gsap.min.js` | Official GSAP core library (standalone, zero-npm required) |
| `vendor/gsap/ScrollTrigger.min.js` | GSAP ScrollTrigger plugin for pinning & scroll scrubbing |
| `scroll-video.js` | Modular JavaScript controller (frame caching, DPR scaling, scrubbing, telemetry) |
| `scroll-video.css` | Isolated stylesheet for pinned viewport, canvas, controls, and HUD |
| `scroll-video-demo.html` | Interactive demo page — open in any browser to test immediately |
| `frames/` | Sample 144 WebP frames (numbered `frame_000.webp` to `frame_143.webp`) |
| `video.mp4` | Sample fallback video file |

---

## 🚀 Instant Test

1. Open `scroll-video-demo.html` directly in your browser or with Live Server.
2. Scroll up and down to scrub through the video frames.
3. Test the interactive scrubber, chapter buttons, engine toggle (Canvas vs Video), and the **"▶ Fly Through"** autoplay button.

---

## 🎬 How to Use Your Own Video

If you have a video (e.g. from `../HERO SECTION VIDEO/`):

### Step 1: Export Video Frames as WebP
Use `ffmpeg` to extract crisp, lightweight WebP frames (recommended 24fps or 30fps):

```bash
# Create or clean frames folder
mkdir -p frames

# Extract frames (e.g. 1920px wide WebP, 24fps, quality 80)
ffmpeg -i "your-video.mp4" -vf "scale=1920:-1:flags=lanczos,fps=24" -q:v 80 frames/frame_%03d.webp
```

*Note: `%03d` will generate `frame_000.webp`, `frame_001.webp`, etc.*

Count your total frames:
```bash
ls -1 frames/*.webp | wc -l
```

### Step 2: Update Configuration
If your total frame count differs from 144, update `totalFrames` in `scroll-video.js` or initialize with custom options:

```javascript
const scrollVideo = new ScrollVideoController({
  totalFrames: 180, // your total frame count
  scrollDistance: 3500, // how many pixels of scroll travel before releasing
  videoDuration: 7.5 // video duration in seconds
});
```

---

## 🛠️ Embedding into `index.html`

1. **Add the CSS** in `<head>`:
   ```html
   <link rel="stylesheet" href="scroll-video.css">
   ```

2. **Add the HTML Section** wherever you want the scroll video:
   ```html
   <section id="scroll-video-experience" class="scroll-video-section">
     <div id="scroll-video-viewport" class="scroll-video-viewport">
       <div class="scroll-video-media-wrap">
         <canvas id="scroll-video-canvas" class="scroll-video-canvas"></canvas>
         <video id="scroll-video-native" class="scroll-video-native" src="video.mp4" playsinline muted preload="auto"></video>
         <div class="scroll-video-vignette"></div>
       </div>

       <!-- Optional HUD & Controls (see scroll-video-demo.html) -->
       ...
     </div>
   </section>
   ```

3. **Add the Scripts** before `</body>`:
   ```html
   <script src="vendor/gsap/gsap.min.js"></script>
   <script src="vendor/gsap/ScrollTrigger.min.js"></script>
   <script src="scroll-video.js"></script>
   ```
