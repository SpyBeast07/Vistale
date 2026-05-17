/**
 * Thread-Safe Isolated Vision Frame Interface
 * Compatible drop-in representation of react-native-vision-camera's Frame.
 */
export interface Frame {
  width: number;
  height: number;
  orientation: string;
  pixelFormat: string;
}

/**
 * Thread-Safe Isolated Vision Frame Processor Worklet
 * Monitors frame dimensions, hardware orientation, and rendering performance (FPS).
 * Throttles diagnostics to once-per-second to prevent system log flooding.
 */

let lastLogTime = Date.now();
let frameCount = 0;

export function scanFrameProcessor(frame: Frame) {
  'worklet';

  frameCount++;
  const currentTime = Date.now();

  // Perform performance check and log diagnostics exactly once per second
  if (currentTime - lastLogTime >= 1000) {
    const elapsedSeconds = (currentTime - lastLogTime) / 1000;
    const computedFps = frameCount / elapsedSeconds;

    console.log(
      `[VisionProcessor] Live Frame: ${frame.width}x${frame.height} | ` +
      `Orientation: ${frame.orientation} | ` +
      `Performance: ${computedFps.toFixed(1)} FPS`
    );

    // Reset tracking counters
    frameCount = 0;
    lastLogTime = currentTime;
  }
}
