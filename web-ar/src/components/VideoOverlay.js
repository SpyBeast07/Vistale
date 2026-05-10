import * as THREE from 'three';

/**
 * VideoOverlay Component
 * 
 * Production-ready video mesh with resource disposal and scaling logic.
 */
export class VideoOverlay {
    constructor(videoElement, options = {}) {
        this.video = videoElement;
        this.options = {
            scale: options.scale || 1.0,
            opacity: options.opacity || 1.0,
            ...options
        };

        this._init();
    }

    _init() {
        // 1. Texture setup
        this.texture = new THREE.VideoTexture(this.video);
        this.texture.minFilter = THREE.LinearFilter;
        this.texture.magFilter = THREE.LinearFilter;
        this.texture.colorSpace = THREE.SRGBColorSpace;

        // 2. Geometry setup
        // We use a 1x1 plane; scaling is handled via the mesh or anchor
        this.geometry = new THREE.PlaneGeometry(1, 1);
        
        // 3. Material setup
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            opacity: this.options.opacity,
            side: THREE.DoubleSide
        });

        // 4. Mesh creation
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.scale.multiplyScalar(this.options.scale);
    }

    /**
     * Set the visibility/playback state
     */
    setActive(isActive) {
        if (isActive) {
            this.video.play().catch(e => console.warn('[VideoOverlay] Play error:', e));
        } else {
            this.video.pause();
        }
    }

    /**
     * Production disposal to prevent memory leaks on mobile
     */
    dispose() {
        this.video.pause();
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.texture.dispose();
        
        if (this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
    }
}
