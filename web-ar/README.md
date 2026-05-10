# Vistale WebAR - Getting Started

You have added your assets:
- Image: `/public/images/tiffin.jpg`
- Video: `/public/videos/tiffin.mp4`

### 1. Compile the Image Target
MindAR does not use JPG files directly for tracking. You must convert `tiffin.jpg` into a `.mind` file.

1. Go to the [Official MindAR Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
2. Upload your `tiffin.jpg`.
3. Click **Compile** and wait.
4. Download the `targets.mind` file.
5. Rename it to `tiffin.mind` and place it in the `web-ar/public/targets/` folder.

### 2. Run the Development Server
1. Open your terminal in the `web-ar` directory.
2. Run `npm run dev`.
3. Open the URL in your browser.
4. Click **START AR EXPERIENCE**.
5. Point your camera at the physical postcard (or display the image on another screen).

### 3. Troubleshooting
- **HTTPS Required**: Camera access requires HTTPS. When testing locally, `localhost` is usually fine, but if you test on a mobile phone over the network, you'll need to use a tool like `ngrok` or host it with HTTPS.
- **Console Logs**: Open the browser console (F12) to see tracking events like `[LOG] Target Found`.
