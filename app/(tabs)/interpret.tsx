import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  TouchableOpacity,
  Vibration,
  Alert,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import {
  Mic,
  MicOff,
  Lock,
  ArrowUp,
  Sparkles,
  Type,
  Send,
  Loader,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function InterpretScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dreamText, setDreamText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation values
  const recordButtonScale = useRef(new Animated.Value(1)).current;
  const lockIndicatorOpacity = useRef(new Animated.Value(0)).current;
  const slideUpY = useRef(new Animated.Value(0)).current;
  
  // Gesture handler ref
  const panGestureRef = useRef();
  
  // Timer ref
  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const handleRecordStart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Button press animation
    Animated.spring(recordButtonScale, {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
    
    // Show lock indicator
    Animated.timing(lockIndicatorOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Haptic feedback
    Vibration.vibrate(50);
    
    // Start recording timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    console.log('Recording started...');
  };

  const handleRecordEnd = () => {
    if (!isLocked) {
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Reset animations
      Animated.spring(recordButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(lockIndicatorOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      console.log('Recording ended...');
    }
  };

  const handleSlideUpToLock = () => {
    setIsLocked(true);
    Vibration.vibrate(100);
    
    // Reset button scale but keep recording
    Animated.spring(recordButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    
    console.log('Recording locked...');
  };

  const handleStopLockedRecording = () => {
    setIsRecording(false);
    setIsLocked(false);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    Animated.timing(lockIndicatorOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    
    console.log('Locked recording stopped...');
  };

  // Pan gesture handler for slide-up-to-lock
  const handlePanGesture = (event) => {
    const { translationY, state } = event.nativeEvent;
    
    if (state === State.ACTIVE && isRecording && !isLocked) {
      // Update slide animation based on gesture
      slideUpY.setValue(Math.max(translationY, -100));
      
      // If user slides up more than 80px, trigger lock
      if (translationY < -80) {
        handleSlideUpToLock();
      }
    }
    
    if (state === State.END || state === State.CANCELLED) {
      // Reset slide animation
      Animated.timing(slideUpY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleSendText = async () => {
    if (dreamText.trim()) {
      setIsProcessing(true);
      // Placeholder for text processing
      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert('Dream Interpretation', 'Your dream has been processed!');
        setDreamText('');
      }, 2000);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.headerContent, { backgroundColor: 'transparent' }]}>
        <Sparkles size={32} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.appTitle}>DreamTalk</Text>
        <Text style={styles.tagline}>Share your dreams, discover their meanings</Text>
      </View>
    </View>
  );

  const renderTextInput = () => (
    <View style={styles.textInputSection}>
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowTextInput(!showTextInput)}
      >
        <Type size={20} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.toggleText}>
          {showTextInput ? 'Hide Text Input' : 'Type Instead'}
        </Text>
      </TouchableOpacity>
      
      {showTextInput && (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe your dream here..."
            placeholderTextColor="#999"
            value={dreamText}
            onChangeText={setDreamText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!dreamText.trim() || isProcessing) && styles.sendButtonDisabled
            ]}
            onPress={handleSendText}
            disabled={!dreamText.trim() || isProcessing}
          >
            {isProcessing ? (
              <Loader size={20} color="#FFFFFF" />
            ) : (
              <Send size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderRecordButton = () => (
    <View style={styles.recordSection}>
      <Text style={styles.recordLabel}>Hold to Record Your Dream</Text>
      
      {/* Lock indicator */}
      <Animated.View
        style={[
          styles.lockIndicator,
          { opacity: lockIndicatorOpacity }
        ]}
      >
        <ArrowUp size={24} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.lockText}>Slide up to lock</Text>
      </Animated.View>
      
      {/* Main record button with gesture handler */}
      <View style={styles.recordButtonContainer}>
        <PanGestureHandler
          ref={panGestureRef}
          onGestureEvent={handlePanGesture}
          onHandlerStateChange={handlePanGesture}
          enabled={isRecording && !isLocked}
        >
          <Animated.View
            style={[
              styles.recordButton,
              { 
                transform: [
                  { scale: recordButtonScale },
                  { translateY: slideUpY }
                ] 
              }
            ]}
          >
            <TouchableOpacity
              style={styles.recordButtonTouch}
              onPressIn={handleRecordStart}
              onPressOut={handleRecordEnd}
              activeOpacity={0.8}
            >
              {isRecording ? (
                <View style={styles.recordingIndicator}>
                  <Mic size={40} color="#FFFFFF" />
                  <View style={styles.recordingPulse} />
                </View>
              ) : (
                <Mic size={40} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
        
        {/* Stop button for locked recording */}
        {isLocked && (
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopLockedRecording}
          >
            <MicOff size={24} color={Colors.underTheMoonlight.midnight} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Recording status */}
      {isRecording && (
        <View style={styles.recordingStatus}>
          <View style={styles.recordingDot} />
          <Text style={styles.recordingTime}>
            {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
          </Text>
          {isLocked && (
            <View style={styles.lockedIndicator}>
              <Lock size={16} color={Colors.underTheMoonlight.dusk} />
              <Text style={styles.lockedText}>Locked</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topSection}>
          {renderHeader()}
          {renderTextInput()}
        </View>
        
        <View style={styles.centerSection}>
          {renderRecordButton()}
        </View>
        
        <View style={styles.bottomSection} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.underTheMoonlight.moonlight,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomSection: {
    height: 100, // Space for tabbar
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.underTheMoonlight.midnight,
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  textInputSection: {
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 12,
  },
  textInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    minHeight: 100,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  recordSection: {
    alignItems: 'center',
  },
  recordLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  lockIndicator: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lockText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    marginTop: 4,
  },
  recordButtonContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.underTheMoonlight.midnight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  recordButtonTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  recordingPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.underTheMoonlight.midnight,
    opacity: 0.3,
  },
  stopButton: {
    position: 'absolute',
    top: -140,
    backgroundColor: '#FFFFFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    marginRight: 8,
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lockedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  lockedText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 4,
    fontWeight: '500',
  },
});