import { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Import real expo-audio functions
let requestRecordingPermissionsAsync: any;
let getRecordingPermissionsAsync: any;

// Try to import expo-audio, fallback to mock if not available
try {
  const ExpoAudio = require('expo-audio');
  requestRecordingPermissionsAsync = ExpoAudio.requestRecordingPermissionsAsync;
  getRecordingPermissionsAsync = ExpoAudio.getRecordingPermissionsAsync;
  console.log('✅ Using real expo-audio permissions');
} catch (error) {
  console.warn('⚠️ expo-audio not available, using mock functions:', error);
  
  // Fallback mock functions
  requestRecordingPermissionsAsync = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ granted: true });
      }, 1000);
    });
  };

  getRecordingPermissionsAsync = async () => {
    return { granted: false };
  };
}

export function useAudioPermissions() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  // Check existing permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      console.log('🔍 Checking existing permissions...');
      const status = await getRecordingPermissionsAsync();
      console.log('📋 Current permission status:', status);
      
      const granted = status.granted || status.status === 'granted';
      setHasPermission(granted);
      
      console.log('🎯 Final permission state:', granted ? 'Granted' : 'Denied');
    } catch (error) {
      console.error('❌ Failed to check permissions:', error);
      setHasPermission(false);
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (hasPermission) {
      return true; // Already have permission
    }

    setIsRequesting(true);
    
    try {
      console.log('🎤 Requesting microphone permission...');
      
      const result = await requestRecordingPermissionsAsync();
      console.log('📝 Raw permission result:', result);
      
      const granted = result.granted || result.status === 'granted';
      
      setHasPermission(granted);
      
      if (!granted) {
        console.log('❌ Permission denied');
        
        // Check if user can be asked again
        const canAskAgain = result.canAskAgain !== false;
        
        if (canAskAgain) {
          Alert.alert(
            'Mikrofon İzni Gerekli',
            'Rüyalarınızı kaydetmek için mikrofon erişimine ihtiyacımız var. Lütfen ayarlardan izin verin.',
            [
              { text: 'İptal', style: 'cancel' },
              { 
                text: 'Ayarlar', 
                onPress: () => {
                  // In a real app, you'd open device settings
                  console.log('Would open settings to grant permission');
                }
              }
            ]
          );
        } else {
          Alert.alert(
            'Mikrofon İzni Gerekli',
            'Mikrofon izni reddedildi. Lütfen cihaz ayarlarından DreamTalk uygulamasına mikrofon izni verin.',
            [{ text: 'Tamam' }]
          );
        }
      } else {
        console.log('✅ Permission granted');
      }
      
      return granted;
    } catch (error) {
      console.error('❌ Permission request failed:', error);
      setHasPermission(false);
      
      Alert.alert(
        'Hata',
        'Mikrofon izni alınırken bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
      
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  // Debug function to reset permissions for testing
  const resetPermissions = async () => {
    console.log('🔄 Refreshing permission status from system...');
    setHasPermission(null); // Reset to unknown state
    await checkPermissions(); // Re-check actual system permissions
  };

  return {
    hasPermission,
    isRequesting,
    requestPermissions,
    checkPermissions,
    resetPermissions, // For testing only
  };
}