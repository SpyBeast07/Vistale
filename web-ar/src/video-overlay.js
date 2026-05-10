import * as THREE from 'three';

/**
 * VideoOverlay Module
 * 
 * Responsible for:
 * 1. Creating a Three.js plane mesh with a video texture
 * 2. Managing the HTML5 Video element lifecycle
 * 3. Controlling playback based on tracking state
 */
export class VideoOverlay {
    constructor(videoUrl) {
        // 1. Create hidden video element
        this.video = document.createElement('video');
        this.video.src = videoUrl;
        this.video.loop = true;
        this.video.muted = true; // Essential for autoplay on mobile
        this.video.crossOrigin = 'anonymous';
        this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        this.video.setAttribute('playsinline', 'playsinline');
        this.video.load();

        // 2. Create Three.js Texture
        const texture = new THREE.VideoTexture(this.video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBAFormat;

        // 3. Create Mesh
        // The plane is 1x1 by default; MindAR will scale the anchor group to match
        // the physical aspect ratio of the image target.
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            side: THREE.DoubleSide // Ensure video is visible from both sides if needed
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Internal state
        this.isFound = false;
    }

    /**
     * Start video playback.
     */
    play() {
        if (this.video.paused) {
            this.video.play().catch(err => {
                console.warn('[VideoOverlay] Playback failed (interaction required?):', err);
            });
        }
    }

    /**
     * Pause video playback.
     */
    pause() {
        if (!this.video.paused) {
            this.video.pause();
        }
    }

    /**
     * Toggle mute state. 
     * Useful if the user taps the screen to enable audio.
     */
    toggleMute() {
        this.video.muted = !this.video.muted;
        return this.video.muted;
    }

    /**
     * Clean up resources.
     */
    dispose() {
        this.pause();
        this.video.src = '';
        this.video.load();
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
    }
}
