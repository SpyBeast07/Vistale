import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContainer}>
          
          {/* Top Minimal Header */}
          <View style={styles.header}>
            <ThemedText type="code" style={styles.logoText}>
              VISTALE
            </ThemedText>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.statusText}>
                Active Node
              </ThemedText>
            </View>
          </View>

          {/* Hero Branding Card */}
          <View style={[styles.heroCard, { backgroundColor: theme.backgroundElement, borderColor: '#292B30' }]}>
            <View style={styles.iconCircle}>
              <SymbolView 
                name="viewfinder" 
                size={40} 
                tintColor="#F3F4F6" 
              />
            </View>
            <ThemedText type="title" style={styles.title}>
              Local Intelligence
            </ThemedText>
            <ThemedText style={styles.subtitle} themeColor="textSecondary">
              Experience seamless local computer vision, optical recognition, and spatial insights instantly.
            </ThemedText>
          </View>

          {/* Core Sleek Action Button */}
          <Pressable 
            onPress={() => router.push('/scan')}
            style={({ pressed }) => [
              styles.scanButton, 
              { 
                backgroundColor: theme.text,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
          >
            <View style={styles.buttonContent}>
              <SymbolView 
                name="barcode.viewfinder" 
                size={20} 
                tintColor={theme.background} 
              />
              <ThemedText style={[styles.scanButtonText, { color: theme.background }]}>
                Initialize Scanner
              </ThemedText>
            </View>
          </Pressable>

          {/* Features Information Grid */}
          <View style={[styles.featuresCard, { backgroundColor: theme.backgroundElement, borderColor: '#292B30' }]}>
            <View style={styles.cardRow}>
              <View style={styles.cardIconWrapper}>
                <SymbolView 
                  name="cpu" 
                  size={16} 
                  tintColor="#F3F4F6" 
                />
              </View>
              <View style={styles.cardTextWrapper}>
                <ThemedText type="smallBold">Edge Processing</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  All neural inference runs locally. Zero servers, zero latency, 100% private.
                </ThemedText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.cardRow}>
              <View style={styles.cardIconWrapper}>
                <SymbolView 
                  name="eye.fill" 
                  size={16} 
                  tintColor="#F3F4F6" 
                />
              </View>
              <View style={styles.cardTextWrapper}>
                <ThemedText type="smallBold">Spatial Recognition</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Detect, segment, and parse environment elements in real time.
                </ThemedText>
              </View>
            </View>
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
  logoText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1D21',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#292B30',
    gap: Spacing.two,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759', // iOS green
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.three,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#121316',
    borderWidth: 1,
    borderColor: '#292B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: Spacing.one,
  },
  scanButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  scanButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  featuresCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  cardIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#121316',
    borderWidth: 1,
    borderColor: '#292B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTextWrapper: {
    flex: 1,
    gap: Spacing.half,
  },
  divider: {
    height: 1,
    backgroundColor: '#292B30',
    marginVertical: Spacing.half,
  },
});
