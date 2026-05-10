/**
 * AR CONFIGURATION
 * 
 * Centralized registry for all AR experiences.
 * Adding a new postcard only requires adding an entry here.
 */
export const AR_CONFIG = [
    {
        id: "tiffin",
        title: "Tiffin Experience",
        target: "/targets/tiffin.mind",
        type: "video",
        video: "/videos/tiffin.mp4",
        thumbnail: "/images/tiffin.jpg",
        options: {
            scale: 1.5,
            autoPlay: true,
            loop: true
        }
    }
];

export const SYSTEM_CONFIG = {
    performance: {
        maxFPS: 60,
        smoothing: 0.5, // 0 to 1
        lowResTracking: true
    },
    ui: {
        showDebug: false,
        themeColor: "#ff4757"
    }
};
