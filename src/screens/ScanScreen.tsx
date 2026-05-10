import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { WebARView } from '../components/WebARView';
import { Ionicons } from '@expo/vector-icons';

/**
 * ScanScreen
 * 
 * Production-grade scanning interface.
 * Handles permission flow and displays the WebAR engine.
 */

import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
const WEB_AR_URL = `https://divine-december-analyst-sensitive.trycloudflare.com`;

export const ScanScreen: React.FC = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [arStatus, setArStatus] = useState('Position your phone over a postcard');
 
  // Request permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleAREvent = (event: string, payload: any) => {
    switch (event) {
      case 'TARGET_FOUND':
        setArStatus(`Detected: ${payload.title || 'Postcard'}`);
        // Here you could trigger haptics or show a UI popup
        break;
      case 'TARGET_LOST':
        setArStatus('Searching for postcard...');
        break;
      case 'ERROR':
        setArStatus(`AR Error: ${payload.message}`);
        break;
    }
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No access to camera</Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. The WebAR Engine */}
      <WebARView 
        url={WEB_AR_URL}
        onEvent={handleAREvent}
        onError={(err) => setArStatus(`Load Error: ${err}`)}
      />

      {/* 2. UI Overlays (Native React Native) */}
      <SafeAreaView style={styles.uiOverlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>VISTALE SCAN</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <View style={styles.footer}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{arStatus}</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    pointerEvents: 'auto',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    pointerEvents: 'none',
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 71, 87, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#ff4757',
    marginBottom: 20,
  },
  btn: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  btnText: {
    color: '#000',
    fontWeight: 'bold',
  }
});
