import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * WebARView Component
 * 
 * A specialized WebView wrapper for the standalone WebAR engine.
 * Handles communication bridge, loading states, and camera permissions.
 */

interface WebARViewProps {
  url: string;
  targetId?: string;
  onEvent?: (event: string, data: any) => void;
  onError?: (error: string) => void;
}

export const WebARView: React.FC<WebARViewProps> = ({ 
  url, 
  targetId, 
  onEvent, 
  onError 
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Send initial data to WebAR once loaded
  const onPageLoad = () => {
    setIsLoading(false);
    if (targetId) {
      sendMessage('SET_TARGET', { id: targetId });
    }
  };

  /**
   * Send a message to the WebAR engine
   */
  const sendMessage = (type: string, payload: any) => {
    const js = `window.handleRNMessage && window.handleRNMessage(${JSON.stringify({ type, payload })})`;
    webViewRef.current?.injectJavaScript(js);
  };

  /**
   * Handle messages coming FROM the WebAR engine
   */
  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('[WebARView] Message from Web:', data);
      
      if (onEvent) {
        onEvent(data.event, data.payload);
      }
    } catch (e) {
      console.warn('[WebARView] Failed to parse message:', e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onLoad={onPageLoad}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowsFullscreenVideo={true}
        mixedContentMode="always"
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          onError && onError(nativeEvent.description);
        }}
        // Essential for MindAR camera access on Android/iOS
        onPermissionRequest={(event) => {
          const { resources } = event.nativeEvent;
          if (resources.includes('video') || resources.includes('camera')) {
            event.grant(resources);
          }
        }}
        // Mimic a standard mobile browser to unlock all Web APIs
        userAgent="Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
      />
      
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff4757" />
          <Text style={styles.loaderText}>Initializing AR Engine...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  loaderText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    opacity: 0.8,
  },
});
