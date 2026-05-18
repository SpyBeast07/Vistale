export interface Point2D {
  x: number;
  y: number;
}

/**
 * Represent a single detected outline or path from OpenCV contour tracing.
 */
export type ContourPath = Point2D[];

/**
 * Unified modular result returned by the Tourism OpenCV Edge Contour Engine.
 */
export interface OpenCVAnalysisResult {
  detected: boolean;
  contours: ContourPath[];
  processingTimeMs: number;
  dimensions: {
    width: number;
    height: number;
  };
}
