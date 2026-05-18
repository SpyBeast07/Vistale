import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

import { CameraView } from '@/components/camera-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { detectPostcardContours } from '@/vision/opencv/opencv-processor';
import { ContourPath } from '@/vision/opencv/types';

type ScanStatus = 'IDLE' | 'SCANNING' | 'SUCCESS';

export default function ScanScreen() {
  const theme = useTheme();
  const [status, setStatus] = useState<ScanStatus>('SCANNING');
  const [scanResult, setScanResult] = useState<string>('');
  const [detectedContours, setDetectedContours] = useState<ContourPath[]>([]);

  // Continuous sweeping laser shared value
  const laserPosition = useSharedValue(0);

  useEffect(() => {
    laserPosition.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      -1, // Infinite
      true // Ping-pong direction
    );
  }, []);

  const animatedLaserStyle = useAnimatedStyle(() => {
    return {
      top: `${laserPosition.value * 100}%`,
    };
  });

  // OpenCV Frame Processing Loop
  useEffect(() => {
    if (status === 'SCANNING') {
      let active = true;
      const runProcessor = () => {
        if (!active) return;
        
        // Process contour outlines at 60 FPS
        const analysis = detectPostcardContours(200, 200);
        setDetectedContours(analysis.contours);
        
        requestAnimationFrame(runProcessor);
      };
      
      runProcessor();
      return () => {
        active = false;
      };
    } else {
      setDetectedContours([]);
    }
  }, [status]);

  const handleReset = () => {
    setStatus('SCANNING');
    setScanResult('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>

          {/* Minimal Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <SymbolView 
                name="chevron.left" 
                size={22} 
                tintColor="#F3F4F6" 
              />
            </Pressable>
            <ThemedText type="code" style={styles.headerTitle}>
              VIEWPORT SCANNER
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* Viewfinder Scan Area */}
          <View style={[styles.viewportCard, { backgroundColor: theme.backgroundElement, borderColor: '#292B30' }]}>
            {/* Live Camera Stream / Web Fallback Mockup (ALWAYS active!) */}
            <CameraView isActive={true} />
            
            {status === 'SCANNING' ? (
              <Pressable 
                onPress={() => {
                  setStatus('SUCCESS');
                  setScanResult('Amalfi Coast, Italy (AR Experience)');
                }}
                style={[
                  styles.viewfinder, 
                  styles.viewfinderScanning
                ]}
              >
                {/* Corner Viewfinder brackets */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Edge Contour Overlay */}
                {detectedContours.map((contour, idx) => {
                  if (contour.length < 4) return null;
                  const minX = Math.min(...contour.map(p => p.x));
                  const maxX = Math.max(...contour.map(p => p.x));
                  const minY = Math.min(...contour.map(p => p.y));
                  const maxY = Math.max(...contour.map(p => p.y));
                  
                  return (
                    <View
                      key={idx}
                      style={[
                        styles.contourOverlayFrame,
                        {
                          left: minX,
                          top: minY,
                          width: maxX - minX,
                          height: maxY - minY,
                        }
                      ]}
                    />
                  );
                })}

                {/* Sweeping Laser */}
                <Animated.View style={[styles.laserLine, animatedLaserStyle]} />

                {/* Central Spinner */}
                <ActivityIndicator size="large" color="#34C759" />
              </Pressable>
            ) : (
              <View style={[StyleSheet.absoluteFillObject, styles.arPortalOverlay]}>
                <View style={[styles.arMediaCard, { backgroundColor: 'rgba(28, 29, 33, 0.85)', borderColor: '#292B30' }]}>
                  {/* Destination image with play button overlay */}
                  <View style={styles.mediaContainer}>
                    <View style={[styles.mediaPlaceholder, { backgroundColor: '#121316' }]}>
                      <SymbolView name="play.circle.fill" size={48} tintColor="#34C759" />
                      <ThemedText style={styles.mediaPlayText}>Playing Immersive AR Video...</ThemedText>
                    </View>
                    {/* Live AR badge */}
                    <View style={styles.arLiveBadge}>
                      <View style={styles.liveDot} />
                      <ThemedText style={styles.arLiveText}>AR PORTAL ACTIVE</ThemedText>
                    </View>
                  </View>

                  {/* Travel Description metadata */}
                  <View style={styles.arMetadata}>
                    <ThemedText type="smallBold" style={styles.arTitle}>
                      Amalfi Coast, Italy
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.arDescription}>
                      Immersive travel video exploring cliffside villages, historic landmarks, and scenic Mediterranean coastlines.
                    </ThemedText>
                  </View>
                  
                  {/* Close Portal Button */}
                  <Pressable 
                    onPress={handleReset} 
                    style={({ pressed }) => [
                      styles.closePortalButton,
                      { opacity: pressed ? 0.85 : 1 }
                    ]}
                  >
                    <SymbolView name="xmark" size={12} tintColor="#FFFFFF" />
                    <ThemedText style={styles.closePortalText}>Close Experience</ThemedText>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Prompt overlay banner */}
            <View style={styles.promptWrapper}>
              {status === 'SCANNING' && (
                <ThemedText type="small" style={styles.scanningText}>
                  Tap brackets to simulate postcard scan
                </ThemedText>
              )}
            </View>

          </View>

          {/* Bottom Custom HUD Control Panel */}
          <View style={[styles.controlPanelCard, { backgroundColor: theme.backgroundElement, borderColor: '#292B30' }]}>
            
            <View style={styles.metadataWrapper}>
              <View style={styles.statusRow}>
                <SymbolView name="sparkles" size={14} tintColor="#34C759" />
                <ThemedText type="small" themeColor="textSecondary">
                  Engine: <ThemedText type="smallBold">Vistale Tourism AR v1.0</ThemedText>
                </ThemedText>
              </View>

              {status === 'SUCCESS' ? (
                <View style={styles.resultBox}>
                  <SymbolView name="play.rectangle.fill" size={16} tintColor="#34C759" />
                  <ThemedText style={styles.resultValueText}>
                    {scanResult}
                  </ThemedText>
                </View>
              ) : (
                <ThemedText type="small" themeColor="textSecondary" style={styles.statusInfoText}>
                  Point your camera lens at any Vistale-activated postcard to unlock travel guides, interactive videos, and audio commentary.
                </ThemedText>
              )}
            </View>

            {status === 'SUCCESS' && (
              <Pressable 
                onPress={handleReset}
                style={({ pressed }) => [
                  styles.panelButton, 
                  { 
                    backgroundColor: '#121316', 
                    borderColor: '#292B30', 
                    borderWidth: 1, 
                    opacity: pressed ? 0.8 : 1 
                  }
                ]}
              >
                <ThemedText style={styles.panelButtonText}>
                  Scan Another Postcard
                </ThemedText>
              </Pressable>
            )}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: BottomTabInset + Spacing.four,
  },
  mainContainer: {
    width: '100%',
    maxWidth: 460,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    marginTop: Spacing.two,
  },
  backButton: {
    paddingVertical: Spacing.one,
    paddingRight: Spacing.four,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  placeholder: {
    width: 24,
  },
  viewportCard: {
    borderRadius: 24,
    borderWidth: 1,
    minHeight: 340,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  viewfinder: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  viewfinderScanning: {
    transform: [{ scale: 1.02 }],
  },
  viewfinderSuccess: {
    transform: [{ scale: 1.0 }],
  },
  corner: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderColor: '#8E9AA8',
    borderWidth: 0,
  },
  cornerSuccess: {
    borderColor: '#34C759',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  promptWrapper: {
    position: 'absolute',
    bottom: Spacing.four,
    alignItems: 'center',
  },
  scanningText: {
    color: '#F3F4F6',
    fontWeight: '600',
  },
  successText: {
    color: '#34C759',
    fontWeight: '700',
  },
  controlPanelCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  metadataWrapper: {
    gap: Spacing.two,
    minHeight: 48,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  resultValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#34C759',
  },
  statusInfoText: {
    fontSize: 13,
  },
  panelButton: {
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  scanningStatusBadge: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  arPortalOverlay: {
    backgroundColor: 'rgba(18, 19, 22, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  arMediaCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  mediaContainer: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.one,
  },
  mediaPlayText: {
    fontSize: 12,
    color: '#8E9AA8',
    fontWeight: '500',
  },
  arLiveBadge: {
    position: 'absolute',
    top: Spacing.two,
    left: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(52, 199, 89, 0.4)',
    gap: Spacing.one,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
  },
  arLiveText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: 1,
  },
  arMetadata: {
    gap: Spacing.half,
  },
  arTitle: {
    fontSize: 15,
    color: '#F3F4F6',
  },
  arDescription: {
    fontSize: 11,
    lineHeight: 16,
  },
  closePortalButton: {
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 69, 58, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  closePortalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF453A',
  },
  contourOverlayFrame: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#34C759',
    borderRadius: 12,
    borderStyle: 'dashed',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
});
