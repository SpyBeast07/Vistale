import { AR_CONFIG } from './config/ar-config.js';
import { ARTracker } from './core/ARTracker.js';
import { AssetLoader } from './core/AssetLoader.js';
import { OverlayManager } from './managers/OverlayManager.js';

/**
 * PRODUCTION WEBAR ENGINE
 * 
 * Scalable architecture for Tourism AR experiences.
 */

class WebAREngine {
    constructor() {
        this.assetLoader = new AssetLoader();
        this.overlayManager = new OverlayManager(this.assetLoader);
        this.tracker = null;
        
        this.ui = {
            loading: document.getElementById('loading-screen'),
            status: document.getElementById('loading-status')
        };
    }

    /**
     * Bridge: Communication with React Native
     */
    setupBridge() {
        // 1. Send events TO React Native
        this.sendToRN = (event, payload = {}) => {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ event, payload }));
            }
        };

        // 2. Receive messages FROM React Native
        window.handleRNMessage = (data) => {
            const { type, payload } = data;
            
            switch (type) {
                case 'SET_TARGET':
                    // Future: Dynamically filter or focus on a specific target
                    break;
                case 'TOGGLE_MUTE':
                    // Future: Toggle audio from RN UI
                    break;
            }
        };
    }

    async init() {
        try {
            this.setupBridge();
            this.updateStatus("Preloading assets...");
            await this.assetLoader.preloadAll(AR_CONFIG);

            this.updateStatus("Initializing AR engine...");
            // We use the first target as the primary source (multi-target .mind)
            const primaryTarget = AR_CONFIG[0].target;
            
            this.tracker = new ARTracker({
                container: document.getElementById('ar-container'),
                targetPath: primaryTarget
            });

            this.updateStatus("Setting up overlays...");
            for (let i = 0; i < AR_CONFIG.length; i++) {
                const config = AR_CONFIG[i];
                const overlay = await this.overlayManager.createOverlay(config);
                
                // Register anchor (i corresponds to the index in the .mind file)
                const anchor = this.tracker.registerAnchor(
                    i,
                    () => {
                        overlay.setActive(true);
                        this.sendToRN('TARGET_FOUND', { id: config.id, title: config.title });
                    },
                    () => {
                        overlay.setActive(false);
                        this.sendToRN('TARGET_LOST', { id: config.id });
                    }
                );
                
                anchor.group.add(overlay.mesh);
            }

            this.setupUI();
            
            // Auto-start for seamless integration
            this.start();
            this.hideLoading();

        } catch (error) {
            console.error('[Engine] Init failed:', error);
            this.updateStatus(`Error: ${error.message}`);
        }
    }

    setupUI() {
        // Handle window resize
        window.addEventListener('resize', () => {
            // MindAR handles internal resize
        });

        // Optimization: handle backgrounding
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.overlayManager.overlays.forEach(o => o.setActive(false));
            }
        });
    }

    async start() {
        try {
            // Unlocking videos for autoplay (browser restriction bypass)
            this.assetLoader.cache.forEach(video => {
                video.play().then(() => video.pause()).catch(() => {});
            });

            await this.tracker.start();
            
            // Rendering loop
            const { renderer, scene, camera } = this.tracker;
            renderer.setAnimationLoop(() => {
                renderer.render(scene, camera);
            });
            
        } catch (err) {
            console.error('[Engine] Start failed:', err);
            this.sendToRN('ERROR', { message: err.message });
            alert(`AR Error: ${err.message}`);
            this.ui.startBtn.disabled = false;
            this.ui.startBtn.textContent = "START EXPERIENCE";
        }
    }

    updateStatus(msg) {
        if (this.ui.status) this.ui.status.textContent = msg;
    }

    hideLoading() {
        this.ui.loading.style.opacity = '0';
        setTimeout(() => this.ui.loading.style.display = 'none', 500);
    }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
    const engine = new WebAREngine();
    engine.init();
});
