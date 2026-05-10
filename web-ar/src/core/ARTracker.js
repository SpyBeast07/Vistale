import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';

/**
 * ARTracker Core
 * 
 * Manages MindAR lifecycle and anchor registration.
 */
export class ARTracker {
    constructor({ container, targetPath }) {
        this.mindarThree = new MindARThree({
            container,
            imageTargetSrc: targetPath,
            uiLoading: "no", // Custom loading UI handled by main app
            uiScanning: "no",
            filterMinCF: 0.0001, // Stability tuning
            filterBeta: 0.001,
            warmupTolerance: 5,
            missTolerance: 5,
        });

        const { renderer, scene, camera } = this.mindarThree;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        
        this.anchors = [];
    }

    async start() {
        try {
            if (!window.isSecureContext) {
                // Not a secure context, but we let it try anyway as it might be localhost
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                const msg = 'Camera API (getUserMedia) is not available. This is usually caused by using an insecure HTTP connection on a network IP. Please use HTTPS or Localhost Port Forwarding.';
                console.error(`[ARTracker] ${msg}`);
                throw new Error(msg);
            }

            await this.mindarThree.start();
        } catch (err) {
            console.error('[ARTracker] Start failed:', err);
            throw err;
        }
    }

    stop() {
        this.mindarThree.stop();
        this.renderer.setAnimationLoop(null);
    }

    /**
     * Create an anchor and attach event listeners
     */
    registerAnchor(index, onFound, onLost) {
        const anchor = this.mindarThree.addAnchor(index);
        
        anchor.onTargetFound = () => {
            if (onFound) onFound();
        };

        anchor.onTargetLost = () => {
            if (onLost) onLost();
        };

        this.anchors.push(anchor);
        return anchor;
    }

    dispose() {
        this.stop();
        this.anchors = [];
    }
}
