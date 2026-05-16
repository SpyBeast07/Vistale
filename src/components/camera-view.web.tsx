import { SymbolView } from 'expo-symbols';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CameraViewProps {
  isActive: boolean;
}

export function CameraView({ isActive }: CameraViewProps) {
  const theme = useTheme();

  // Radar sweep animation for Web
  const sweepAngle = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      sweepAngle.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1, // Infinite
        false // Do not reverse (keep spinning)
      );
    } else {
      sweepAngle.value = 0;
    }
  }, [isActive]);

  const animatedSweepStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${sweepAngle.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: '#07080a' }]}>
      {/* Visual Concentric Circular Radar Grid */}
      <View style={[styles.circle, styles.circleLg, { borderColor: '#1c1d21' }]} />
      <View style={[styles.circle, styles.circleMd, { borderColor: '#222329' }]} />
      <View style={[styles.circle, styles.circleSm, { borderColor: '#292b30' }]} />

      {/* Axis crosshairs */}
      <View style={[styles.axis, styles.axisH, { backgroundColor: '#1c1d21' }]} />
      <View style={[styles.axis, styles.axisV, { backgroundColor: '#1c1d21' }]} />

      {/* Sweeping Radar Scanner Line */}
      {isActive && (
        <Animated.View style={[styles.sweepLine, animatedSweepStyle]} />
      )}

      {/* Branding overlay */}
      <View style={styles.hudOverlay}>
        <View style={styles.badge}>
          <SymbolView name="sparkles" size={10} tintColor="#34C759" />
          <ThemedText style={styles.badgeText}>WEB SIMULATOR</ThemedText>
        </View>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Visual feed emulated
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  circleLg: {
    width: 240,
    height: 240,
  },
  circleMd: {
    width: 160,
    height: 160,
  },
  circleSm: {
    width: 80,
    height: 80,
  },
  axis: {
    position: 'absolute',
  },
  axisH: {
    width: '80%',
    height: 1,
  },
  axisV: {
    width: 1,
    height: '80%',
  },
  sweepLine: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRightWidth: 1.5,
    borderRightColor: '#34C759',
    borderRadius: 999,
    opacity: 0.15,
  },
  hudOverlay: {
    position: 'absolute',
    alignItems: 'center',
    gap: Spacing.one,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(52, 199, 89, 0.3)',
    gap: Spacing.one,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34C759',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
  },
});
