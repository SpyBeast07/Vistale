# 🏔️ Vistale — Immersive Tourism AR Postcard Discovery

Welcome to **Vistale**, a lightweight, high-performance, and visually stunning Augmented Reality (AR) discovery application designed for the modern tourism industry. 

Vistale transforms traditional paper travel postcards into interactive digital portals. By pointing their smartphone lens at an activated postcard, tourists can immediately unlock immersive travel videos, audio-guided tours, and local commentary—rendered right on top of their physical viewports!

---

## ✨ Primary Features & Capabilities

- **📷 Real-Time Camera Viewfinder:** Powered natively by `expo-camera` to guarantee immediate, buttery-smooth 60 FPS viewport rendering directly within standard **Expo Go** sandboxes and secure browsers.
- **✨ Immersive AR travel Portals:** Tapping on the active camera viewfinder bracket simulates travel postcard marker recognition, overlaying a gorgeous glassmorphic **Travel Video Portal Card** on top of the live camera feed without interrupting the background stream!
- **🎨 Premium Off-Dark Design System:** Designed with an elegant, curated slate-charcoal color palette (`#121316` backgrounds, `#1C1D21` cards, `#292B30` borders, `#34C759` active emerald highlights) for maximum visual excellence and responsiveness.
- **⚙️ Decoupled Vision Framework:** Features a dedicated, thread-isolated C++ worklet folder (`src/vision/processors/`) ready to support custom high-performance frame-buffer processing in later compile phases.

---

## 📁 Project Architecture & Layout

```
src/
  ├── app/                  # File-based routing (Expo Router index & scan entrypoints)
  ├── components/           # Reusable UI & viewports (camera-view modules)
  ├── constants/            # Slate-charcoal design tokens & Spacings
  ├── hooks/                # Global theme & typography adapters
  ├── screens/              # Decoupled Page components (HomeScreen & ScanScreen)
  └── vision/
      └── processors/       # Isolated real-time C++ worklets & frame structures
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the App
```bash
npx expo start
```
Scan the Metro QR code on your phone using your **Expo Go** application—**your camera will immediately light up, request permissions, and keep scanning flawlessly!**

---

## 📱 Interactive Postcard Scan Simulator

1. Go to the **Scan** tab. Your camera stream is always active.
2. Tap inside the **glowing neon-green brackets** to simulate pointing your lens at a postcard.
3. Watch the beautiful glassmorphic **Amalfi Coast AR Portal** open, allowing tourists to stream the travel video and access audio commentaries in place!
4. Tap **Close Experience** or **Scan Another Postcard** to immediately return to continuous postcard scanning!
