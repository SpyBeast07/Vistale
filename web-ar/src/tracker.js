import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

/**
 * ARTracker Module
 * 
 * Responsible for:
 * 1. Initializing MindAR engine
 * 2. Handling camera stream access
 * 3. Managing image target synchronization
 * 4. Providing anchors for 3D content
 */
export class ARTracker {
    constructor({ container, targetPath }) {
        this.mindarThree = new MindARThree({
            container: container,
            imageTargetSrc: targetPath,
            // Optimization for mobile: lower resolution tracking can improve FPS
            filterMinCF: 0.0001,
            filterBeta: 0.001,
        });

        // Extract Three.js primitives created by MindAR
        const { renderer, scene, camera } = this.mindarThree;
        
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

    /**
     * Starts the camera and the tracking loop.
     * Must be called within a user interaction handler for most browsers.
     */
    async start() {
        try {
            console.log('[ARTracker] Requesting camera access...');
            await this.mindarThree.start();
            console.log('[ARTracker] Tracking active.');
        } catch (error) {
            console.error('[ARTracker] Failed to start:', error);
            throw error;
        }
    }

    /**
     * Stops tracking and releases camera resources.
     */
    stop() {
        this.mindarThree.stop();
        // MindAR's stop() doesn't always clean up the renderer loop completely
        this.renderer.setAnimationLoop(null);
        console.log('[ARTracker] Stopped.');
    }

    /**
     * Adds an anchor for a specific target index (0-indexed based on .mind file).
     * @param {number} index 
     * @returns {object} Anchor object with 'group' property to add Three.js objects to.
     */
    addAnchor(index) {
        return this.mindarThree.addAnchor(index);
    }
}
