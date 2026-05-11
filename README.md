# Vistale Tourism WebAR 🌍✨

Vistale is a production-grade Augmented Reality application for tourism, designed to bring physical postcards and landmarks to life using **WebAR (MindAR + Three.js)** integrated into a **React Native Expo** application.

## 🚀 Architecture Overview

This project uses a hybrid architecture for maximum flexibility and performance:

- **Host App (React Native Expo)**: Manages UI, user authentication, profile, and the scanning interface.
- **AR Engine (Standalone WebAR)**: A high-performance, modular AR engine bundled with Vite. It runs inside a native WebView with a bi-directional communication bridge.
- **Communication Bridge**: Custom messaging protocol for `TARGET_FOUND` and `TARGET_LOST` events, allowing the native app to react to AR interactions.

---

## 🛠️ Tech Stack

- **Native**: React Native, Expo, Expo Router, Lucide Icons.
- **AR Core**: MindAR (Image Tracking), Three.js (3D Rendering).
- **Bundler**: Vite (for the AR Engine).
- **Bridge**: `react-native-webview`.

---

## 🏗️ Project Structure

```text
.
├── src/                    # React Native Expo Source
│   ├── app/                # Expo Router screens
│   ├── components/         # Shared native components (e.g., WebARView)
│   └── screens/            # Native screen implementations (ScanScreen)
├── web-ar/                 # Standalone WebAR Engine (Vite project)
│   ├── src/                # Modular AR Managers & Services
│   │   ├── core/           # AR Tracker & Asset Loader
│   │   └── managers/       # Overlay Manager (Scaling, Lifecycle)
│   └── public/             # AR Assets (.mind files, videos, textures)
└── README.md
```

---

## 🏁 Quick Start

### 1. Start the WebAR Engine
```bash
cd web-ar
npm install
npm run dev
```

### 2. Expose the Engine (For physical device testing)
Since WebAR requires a **Secure Context (HTTPS)**, use a tunnel:
```bash
# Using Cloudflare (No account needed)
npx cloudflared tunnel --url http://localhost:5173
```
*Copy the `https://...` URL provided.*

### 3. Start the Native App
1. Open `src/screens/ScanScreen.tsx`.
2. Update `WEB_AR_URL` with your tunnel address.
3. Run:
```bash
npx expo start
```
4. Scan the QR code with **Expo Go** on your Android or iOS device.

---

## 📸 Image Tracking Pipeline
MindAR requires pre-compiled `.mind` files for tracking.
1. Upload your image to the [MindAR Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
2. Download the `.mind` file and place it in `web-ar/public/targets/`.
3. Add the entry to `web-ar/src/config/ar-config.js`.

---

## 📄 License
© 2026 Eurobliz Internship Project.
