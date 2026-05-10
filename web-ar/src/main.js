import { ASSETS } from './assets.js';
import { ARTracker } from './tracker.js';
import { ARScene } from './ar-scene.js';
import { VideoOverlay } from './video-overlay.js';

/**
 * MAIN ENGINE ENTRY POINT
 * 
 * Orchestrates the lifecycle of the AR experience.
 * Separates concerns by delegating to specialized modules.
 */

const UI = {
    loading: document.getElementById('loading-screen'),
    startBtn: document.getElementById('start-btn'),
    overlay: document.getElementById('ui-overlay')
};

let tracker, scene, videoOverlay;

/**
 * Initialization function
 */
const init = async () => {
    try {
        const container = document.getElementById('ar-container');

        // 1. Initialize Tracker (MindAR)
        tracker = new ARTracker({
            container,
            targetPath: ASSETS.targets.postcard
        });

        // 2. Initialize Scene (Three.js Wrapper)
        scene = new ARScene(tracker.renderer, tracker.scene, tracker.camera);

        // 3. Create Video Overlay
        videoOverlay = new VideoOverlay(ASSETS.videos.promo);

        // 4. Setup Anchors
        // We use index 0 as the postcard target
        const anchor = tracker.addAnchor(0);
        anchor.group.add(videoOverlay.mesh);

        // 5. Tracking Event Listeners
        anchor.onTargetFound = () => {
            console.log('[LOG] Target Found: Postcard');
            videoOverlay.play();
        };

        anchor.onTargetLost = () => {
            console.log('[LOG] Target Lost: Postcard');
            videoOverlay.pause();
        };

        // 6. UI Interaction
        UI.startBtn.addEventListener('click', async () => {
            UI.startBtn.disabled = true;
            UI.startBtn.textContent = 'INITIALIZING...';
            
            await tracker.start();
            
            // Start the rendering loop
            scene.startLoop();
            
            // Hide UI
            UI.overlay.style.display = 'none';
        });

        // Remove loading screen
        UI.loading.style.opacity = '0';
        setTimeout(() => UI.loading.remove(), 500);

    } catch (error) {
        console.error('[CRITICAL] Initialization failed:', error);
        UI.loading.textContent = 'Error: Check console for details.';
    }
};

// Lifecycle: Handle page visibility (optimization)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (videoOverlay) videoOverlay.pause();
        if (scene) scene.stopLoop();
    } else {
        if (scene) scene.startLoop();
    }
});

// Start initialization
window.addEventListener('DOMContentLoaded', init);
