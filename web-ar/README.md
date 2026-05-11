# Vistale WebAR Engine ⚡️

A modular, production-ready WebAR engine built with **MindAR** and **Three.js**, designed for seamless integration into native mobile applications.

## ✨ Key Features
- **Auto-Start**: Instant camera activation on page load.
- **Resource Management**: Dynamic preloading and auto-disposal of video textures to prevent memory leaks on mobile devices.
- **Bi-directional Bridge**: Real-time messaging to React Native via `window.ReactNativeWebView`.
- **Config-Driven**: Add new AR targets by simply updating `src/config/ar-config.js`.
- **Performance Optimized**: Built-in smoothing, asset caching, and mobile-first rendering.

---

## 🏗️ Architecture

- **ARTracker.js**: Hardened wrapper for MindAR lifecycle.
- **AssetLoader.js**: Promise-based asset preloader with browser-restriction bypassing (autoplay unlock).
- **OverlayManager.js**: Factory for creating and managing AR overlays (videos, 3D models).
- **VideoOverlay.js**: Efficient video mesh implementation with lifecycle hooks.

---

## 🛠️ Development

### Setup
```bash
npm install
npm run dev
```

### Adding New Postcards
1. **Target**: Convert your JPG to `.mind` using the [MindAR Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
2. **Assets**: Place the `.mind` target in `/public/targets/` and your video in `/public/videos/`.
3. **Config**: Add an entry to `src/config/ar-config.js`:
```javascript
{
    id: "your_id",
    title: "Display Name",
    target: "/targets/your_file.mind",
    video: "/videos/your_video.mp4",
    options: { scale: 1.2 }
}
```

---

## 🔒 Secure Context & Tunneling
WebAR requires **HTTPS** for camera access. During development:
- Use **Cloudflare Tunnel**: `npx cloudflared tunnel --url http://localhost:5173`.
- Use **USB Port Forwarding** (Android): `adb reverse tcp:5173 tcp:5173`.

---

## 📦 Production Build
```bash
npm run build
```
The output will be in the `dist/` folder. Host these files on any static HTTPS server (Vercel, S3, MinIO) and point the React Native WebView to your production URL.
