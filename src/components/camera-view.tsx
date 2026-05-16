import { SymbolView } from 'expo-symbols';
import React, { useEffect } from 'react';
import { StyleSheet, View, Pressable, ActivityIndicator } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface CameraViewProps {
  isActive: boolean;
}

export function CameraView({ isActive }: CameraViewProps) {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // 1. Loading Permissions State
  if (!permission) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.backgroundElement }]}>
        <ActivityIndicator size="small" color="#8E9AA8" />
      </View>
    );
  }

  // 2. Permission Denied / Not Granted Flow
  if (!permission.granted) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.backgroundElement }]}>
        <View style={styles.iconCircle}>
          <SymbolView name="lock.fill" size={24} tintColor="#8E9AA8" />
        </View>
        <ThemedText type="smallBold" style={styles.titleText}>
          Camera Access Required
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.bodyText}>
          Vistale needs camera permissions to render the real-time visual card scanner.
        </ThemedText>
        <Pressable 
          onPress={requestPermission} 
          style={({ pressed }) => [
            styles.permissionButton, 
            { backgroundColor: theme.text, opacity: pressed ? 0.9 : 1 }
          ]}
        >
          <ThemedText style={[styles.permissionButtonText, { color: theme.background }]}>
            Grant Access
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  // 3. Render Power-Saving Suspended State
  if (!isActive) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: '#07080a' }]}>
        <ActivityIndicator size="small" color="#34C759" />
      </View>
    );
  }

  // 4. Render Active Camera Viewfinder (Compatible with iOS, Android, and Expo Go)
  return (
    <View style={styles.container}>
      <ExpoCameraView
        style={StyleSheet.absoluteFill}
        facing="back"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 24,
  },
  centeredContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.five,
    borderRadius: 24,
    gap: Spacing.two,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#121316',
    borderWidth: 1,
    borderColor: '#292B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  titleText: {
    fontSize: 15,
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  permissionButton: {
    height: 38,
    paddingHorizontal: Spacing.four,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
