import { VideoOverlay } from '../components/VideoOverlay.js';

/**
 * OverlayManager
 * 
 * Factory that instantiates the correct overlay type based on config.
 * Handles the mapping between targets and their 3D content.
 */
export class OverlayManager {
    constructor(assetLoader) {
        this.assetLoader = assetLoader;
        this.overlays = new Map(); // id -> Overlay Instance
    }

    /**
     * Create an overlay instance for a target config
     */
    async createOverlay(config) {
        let overlay;

        switch (config.type) {
            case 'video':
                const videoElement = await this.assetLoader.loadVideo(config.video);
                overlay = new VideoOverlay(videoElement, config.options);
                break;
                
            case 'model':
                // Future: implementation for GLTFLoader
                console.warn('[OverlayManager] Model type not yet implemented');
                break;

            default:
                throw new Error(`Unknown overlay type: ${config.type}`);
        }

        this.overlays.set(config.id, overlay);
        return overlay;
    }

    getOverlay(id) {
        return this.overlays.get(id);
    }

    /**
     * Clean up all overlays
     */
    disposeAll() {
        this.overlays.forEach(overlay => overlay.dispose());
        this.overlays.clear();
    }
}
