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

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScanStatus = 'IDLE' | 'SCANNING' | 'SUCCESS';

export default function ScanScreen() {
  const theme = useTheme();
  const [status, setStatus] = useState<ScanStatus>('IDLE');
  const [scanResult, setScanResult] = useState<string>('');

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

  const handleSimulateScan = () => {
    if (status === 'SCANNING') return;

    setStatus('SCANNING');
    setScanResult('');

    // Simulate edge model execution latency
    setTimeout(() => {
      setStatus('SUCCESS');
      setScanResult('Vistale Visual Node #8904 - Verified');
    }, 1800);
  };

  const handleReset = () => {
    setStatus('IDLE');
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
            
            <View 
              style={[
                styles.viewfinder, 
                status === 'SCANNING' && styles.viewfinderScanning,
                status === 'SUCCESS' && styles.viewfinderSuccess
              ]}
            >
              {/* Corner Viewfinder brackets */}
              <View style={[styles.corner, styles.topLeft, status === 'SUCCESS' && styles.cornerSuccess]} />
              <View style={[styles.corner, styles.topRight, status === 'SUCCESS' && styles.cornerSuccess]} />
              <View style={[styles.corner, styles.bottomLeft, status === 'SUCCESS' && styles.cornerSuccess]} />
              <View style={[styles.corner, styles.bottomRight, status === 'SUCCESS' && styles.cornerSuccess]} />

              {/* Sweeping Laser (scanning state only) */}
              {status === 'SCANNING' && (
                <Animated.View style={[styles.laserLine, animatedLaserStyle]} />
              )}

              {/* Central Indicator */}
              {status === 'IDLE' && (
                <SymbolView 
                  name="viewfinder" 
                  size={36} 
                  tintColor="#8E9AA8" 
                />
              )}
              {status === 'SCANNING' && (
                <ActivityIndicator size="large" color="#34C759" />
              )}
              {status === 'SUCCESS' && (
                <SymbolView 
                  name="checkmark.circle.fill" 
                  size={40} 
                  tintColor="#34C759" 
                />
              )}
            </View>

            {/* Prompt overlay banner */}
            <View style={styles.promptWrapper}>
              {status === 'IDLE' && (
                <ThemedText type="small" themeColor="textSecondary">
                  Position object inside the brackets to begin
                </ThemedText>
              )}
              {status === 'SCANNING' && (
                <ThemedText type="small" style={styles.scanningText}>
                  Processing frame tensors...
                </ThemedText>
              )}
              {status === 'SUCCESS' && (
                <ThemedText type="small" style={styles.successText}>
                  Verification Completed
                </ThemedText>
              )}
            </View>

          </View>

          {/* Bottom Custom HUD Control Panel */}
          <View style={[styles.controlPanelCard, { backgroundColor: theme.backgroundElement, borderColor: '#292B30' }]}>
            
            <View style={styles.metadataWrapper}>
              <View style={styles.statusRow}>
                <SymbolView name="cpu" size={14} tintColor="#8E9AA8" />
                <ThemedText type="small" themeColor="textSecondary">
                  Network: <ThemedText type="smallBold">EdgeOCR-v2.1</ThemedText>
                </ThemedText>
              </View>

              {status === 'SUCCESS' ? (
                <View style={styles.resultBox}>
                  <SymbolView name="checkmark.seal.fill" size={16} tintColor="#34C759" />
                  <ThemedText style={styles.resultValueText}>
                    {scanResult}
                  </ThemedText>
                </View>
              ) : (
                <ThemedText type="small" themeColor="textSecondary" style={styles.statusInfoText}>
                  {status === 'SCANNING' ? 'Executing convolutional tensor flow...' : 'Awaiting optical target capture.'}
                </ThemedText>
              )}
            </View>

            {status === 'SUCCESS' ? (
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
                  Clear & Scan Next
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable 
                onPress={handleSimulateScan}
                disabled={status === 'SCANNING'}
                style={({ pressed }) => [
                  styles.panelButton, 
                  { 
                    backgroundColor: theme.text, 
                    opacity: (status === 'SCANNING') ? 0.5 : (pressed ? 0.9 : 1),
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                  }
                ]}
              >
                <ThemedText style={[styles.panelButtonText, { color: theme.background }]}>
                  {status === 'SCANNING' ? 'Running Model...' : 'Simulate Visual Scan'}
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
});
