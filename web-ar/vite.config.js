import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Allow the Cloudflare tunnel host to connect to the Vite server
    allowedHosts: [
      'interact-kills-starring-airfare.trycloudflare.com',
      '.trycloudflare.com', // Allow all cloudflare tunnels
      'localhost'
    ],
    host: true, // Listen on all network interfaces
    port: 5173,
    strictPort: true,
    hmr: {
      // Required for HMR to work over the tunnel
      clientPort: 443
    }
  }
});
