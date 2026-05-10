import * as THREE from 'three';

/**
 * ARScene Module
 * 
 * Handles the Three.js environment that lives "inside" the AR world.
 * While MindAR provides the primitives, this module manages the content,
 * lighting, and the rendering loop.
 */
export class ARScene {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        this._setupLighting();
    }

    /**
     * Set up basic lighting. Essential for when 3D models are added later.
     */
    _setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    /**
     * The main animation loop.
     * @param {Function} updateFn Optional callback for frame-by-frame updates.
     */
    startLoop(updateFn) {
        this.renderer.setAnimationLoop(() => {
            if (updateFn) updateFn();
            this.renderer.render(this.scene, this.camera);
        });
    }

    /**
     * Stop the animation loop.
     */
    stopLoop() {
        this.renderer.setAnimationLoop(null);
    }
}
