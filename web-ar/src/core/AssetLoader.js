/**
 * AssetLoader Service
 * 
 * Handles preloading and caching of AR assets (Videos, Textures, Models).
 * Ensures smooth transitions when targets are detected.
 */
export class AssetLoader {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Preloads a video and returns a video element.
     */
    async loadVideo(url) {
        if (this.cache.has(url)) return this.cache.get(url);

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            video.src = url;
            video.preload = 'auto';
            video.crossOrigin = 'anonymous';
            video.webkitPlaysinline = true;
            video.playsinline = true;
            video.muted = true; // Essential for autoplay

            video.onloadedmetadata = () => {
                this.cache.set(url, video);
                resolve(video);
            };

            video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
            
            // Start loading
            video.load();
        });
    }

    /**
     * Load multiple assets in parallel
     */
    async preloadAll(configs) {
        const promises = configs.map(config => {
            if (config.type === 'video') return this.loadVideo(config.video);
            // Future: add loadModel here
            return Promise.resolve();
        });

        return Promise.all(promises);
    }

    /**
     * Clean up specific asset or all assets
     */
    dispose(url) {
        if (url) {
            const video = this.cache.get(url);
            if (video) {
                video.pause();
                video.src = "";
                video.load();
                this.cache.delete(url);
            }
        } else {
            this.cache.forEach((asset, key) => this.dispose(key));
        }
    }
}
