import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const VIEWFINDER_SIZE = width * 0.75;

export default function ScanScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  
  const scanLineY = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { duration: 1500 });

    // Scan line animation (more like a pulse/wave)
    scanLineY.value = withRepeat(
      withTiming(1, { 
        duration: 3500, 
        easing: Easing.bezier(0.4, 0, 0.2, 1) 
      }),
      -1,
      true
    );

    // Button pulse animation (very subtle)
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [scanLineY, pulseScale, opacity]);

  const scanLineStyle = useAnimatedStyle(() => {
    const translateY = interpolate(scanLineY.value, [0, 1], [0, VIEWFINDER_SIZE]);
    const lineOpacity = interpolate(scanLineY.value, [0, 0.1, 0.9, 1], [0, 0.6, 0.6, 0]);
    return {
      transform: [{ translateY }],
      opacity: lineOpacity,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const pulseButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: interpolate(pulseScale.value, [1, 1.05], [0.3, 0.1]),
  }));

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <View style={styles.cameraPlaceholder}>
          <View style={styles.centeredContent}>
            <ThemedText style={styles.permissionText}>
              We need your permission to show the camera
            </ThemedText>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <ThemedText style={styles.permissionButtonText}>Grant Permission</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Actual Camera View */}
      <CameraView style={styles.camera} facing="back">
        {/* Immersive Overlay */}
        <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
          
          {/* Minimalist Top HUD */}
          <BlurView intensity={10} tint="dark" style={styles.topHud}>
            <Pressable style={styles.minimalIconButton}>
              <IconSymbol name="chevron.right" size={20} color="rgba(255,255,255,0.6)" style={{ transform: [{ rotate: '180deg' }] }} />
            </Pressable>
            <ThemedText style={styles.cinematicTitle}>VISTALE</ThemedText>
            <Pressable style={styles.minimalIconButton}>
              <IconSymbol name="paperplane.fill" size={18} color="rgba(255,255,255,0.6)" />
            </Pressable>
          </BlurView>

          {/* Viewfinder Area - Minimal & Cinematic */}
          <View style={styles.viewfinderContainer}>
            <View style={styles.viewfinder}>
              {/* Elegant Corners - Thin, White */}
              <View style={[styles.elegantCorner, styles.topLeft]} />
              <View style={[styles.elegantCorner, styles.topRight]} />
              <View style={[styles.elegantCorner, styles.bottomLeft]} />
              <View style={[styles.elegantCorner, styles.bottomRight]} />

              {/* Scanning Light Beam */}
              <Animated.View style={[styles.scanBeam, scanLineStyle]} />
            </View>
            
            <ThemedText style={styles.emotionalText}>
              Look closer at the world around you
            </ThemedText>
          </View>

          {/* Bottom Shutter - Emotional & Cinematic */}
          <View style={styles.bottomHud}>
            <View style={styles.shutterContainer}>
              <Animated.View style={[styles.shutterPulse, pulseButtonStyle]} />
              <Pressable 
                style={({ pressed }) => [
                  styles.shutterButton,
                  pressed && styles.shutterButtonPressed
                ]}
                onPress={() => {}}>
                <View style={styles.shutterInner} />
              </Pressable>
            </View>
          </View>

        </View>
      </CameraView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  permissionButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle tint to help the white elements pop
  },
  topHud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    overflow: 'hidden',
  },
  cinematicTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 6,
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  minimalIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  viewfinderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    position: 'relative',
  },
  elegantCorner: {
    position: 'absolute',
    width: 15,
    height: 15,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 0.5,
    borderRightWidth: 0.5,
  },
  scanBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  emotionalText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 60,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  bottomHud: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterPulse: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
  },
  shutterButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  shutterButtonPressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: '#f0f0f0',
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});
