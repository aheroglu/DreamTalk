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
  Dimensions,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
  Stars,
  Moon,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  
  // Page transition animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  // Modern UI animations
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const particleAnimation = useRef(new Animated.Value(0)).current;
  const waveAnimation = useRef(new Animated.Value(0)).current;
  const heroContentScale = useRef(new Animated.Value(0.9)).current;
  const heroBg = useRef(new Animated.Value(0)).current;
  
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

  // Enhanced page focus animation with modern effects
  useFocusEffect(
    React.useCallback(() => {
      // Animate in when page comes into focus
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(heroContentScale, {
          toValue: 1,
          tension: 80,
          friction: 10,
          useNativeDriver: true,
          delay: 200,
        }),
        Animated.timing(heroBg, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Start ambient animations
      startAmbientAnimations();

      // Reset animations when page loses focus
      return () => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.95);
        heroContentScale.setValue(0.9);
        heroBg.setValue(0);
      };
    }, [fadeAnim, scaleAnim, heroContentScale, heroBg])
  );
  
  // Ambient animations for mystical atmosphere
  const startAmbientAnimations = () => {
    // Particle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(particleAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(particleAnimation, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Gentle wave animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnimation, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };
  
  const handleRecordStart = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Enhanced button press animation
    Animated.parallel([
      Animated.spring(recordButtonScale, {
        toValue: 1.15,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show lock indicator with bounce
    Animated.spring(lockIndicatorOpacity, {
      toValue: 1,
      tension: 120,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Enhanced haptic feedback
    Vibration.vibrate([0, 100, 50, 100]);
    
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
      
      // Enhanced reset animations
      Animated.parallel([
        Animated.spring(recordButtonScale, {
          toValue: 1,
          tension: 150,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      Animated.spring(lockIndicatorOpacity, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      console.log('Recording ended...');
    }
  };

  const handleSlideUpToLock = () => {
    setIsLocked(true);
    Vibration.vibrate([0, 200, 100, 200]);
    
    // Enhanced lock animation
    Animated.parallel([
      Animated.spring(recordButtonScale, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
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
      <BlurView intensity={20} tint="light" style={styles.headerCard}>
        <View style={[styles.headerContent, { backgroundColor: 'transparent' }]}>
          <View style={styles.iconContainer}>
            <Moon size={32} color={Colors.underTheMoonlight.midnight} />
            <Stars size={28} color={Colors.underTheMoonlight.dusk} style={styles.starsIcon} />
          </View>
          <Text style={styles.appTitle}>DreamTalk</Text>
          <Text style={styles.tagline}>Share your dreams, discover their meanings</Text>
        </View>
      </BlurView>
    </View>
  );

  const renderTextInput = () => (
    <View style={styles.textInputSection}>
      <BlurView intensity={15} tint="light" style={styles.toggleCard}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowTextInput(!showTextInput)}
        >
          <Type size={20} color={Colors.underTheMoonlight.midnight} />
          <Text style={styles.toggleText}>
            {showTextInput ? 'Hide Text Input' : 'Type Instead'}
          </Text>
        </TouchableOpacity>
      </BlurView>
      
      {showTextInput && (
        <BlurView intensity={20} tint="light" style={styles.textInputCard}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your dream here..."
              placeholderTextColor="#666"
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
              <LinearGradient
                colors={[Colors.underTheMoonlight.midnight, Colors.underTheMoonlight.dusk]}
                style={styles.sendButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isProcessing ? (
                  <Loader size={20} color="#FFFFFF" />
                ) : (
                  <Send size={20} color="#FFFFFF" />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      )}
    </View>
  );

  const renderRecordButton = () => (
    <View style={styles.recordSection}>
      <Text style={styles.recordLabel}>Hold to Record Your Dream</Text>
      
      {/* Lock indicator with blur */}
      <Animated.View
        style={[
          styles.lockIndicator,
          { opacity: lockIndicatorOpacity }
        ]}
      >
        <BlurView intensity={10} tint="light" style={styles.lockCard}>
          <ArrowUp size={24} color={Colors.underTheMoonlight.midnight} />
          <Text style={styles.lockText}>Slide up to lock</Text>
        </BlurView>
      </Animated.View>
      
      {/* Hero record button with enhanced design */}
      <View style={styles.recordButtonContainer}>
        <PanGestureHandler
          ref={panGestureRef}
          onGestureEvent={handlePanGesture}
          onHandlerStateChange={handlePanGesture}
          enabled={isRecording && !isLocked}
        >
          <Animated.View
            style={[
              styles.heroButton,
              { 
                transform: [
                  { scale: recordButtonScale },
                  { translateY: slideUpY }
                ] 
              }
            ]}
          >
            <View style={styles.heroButtonShadow}>
              <LinearGradient
                colors={[Colors.underTheMoonlight.midnight, Colors.underTheMoonlight.dusk]}
                style={styles.heroButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <TouchableOpacity
                  style={styles.recordButtonTouch}
                  onPressIn={handleRecordStart}
                  onPressOut={handleRecordEnd}
                  activeOpacity={0.8}
                >
                  {isRecording ? (
                    <View style={styles.recordingIndicator}>
                      <Mic size={48} color="#FFFFFF" strokeWidth={2.5} />
                      <View style={styles.recordingPulse} />
                    </View>
                  ) : (
                    <Mic size={48} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </Animated.View>
        </PanGestureHandler>
        
        {/* Stop button for locked recording */}
        {isLocked && (
          <BlurView intensity={15} tint="light" style={styles.stopButtonCard}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopLockedRecording}
            >
              <MicOff size={24} color={Colors.underTheMoonlight.midnight} />
            </TouchableOpacity>
          </BlurView>
        )}
      </View>
      
      {/* Recording status with glassmorphism */}
      {isRecording && (
        <BlurView intensity={20} tint="light" style={styles.recordingStatusCard}>
          <View style={styles.recordingStatus}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingTime}>
              {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
            </Text>
            {isLocked && (
              <View style={styles.lockedIndicator}>
                <Lock size={16} color={Colors.underTheMoonlight.midnight} />
                <Text style={styles.lockedText}>Locked</Text>
              </View>
            )}
          </View>
        </BlurView>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[
          Colors.underTheMoonlight.moonlight,
          Colors.underTheMoonlight.twilight,
          Colors.underTheMoonlight.dusk,
        ]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.topSection}>
              {renderHeader()}
              {renderTextInput()}
            </View>
            
            <View style={styles.centerSection}>
              {renderRecordButton()}
            </View>
            
            <View style={styles.bottomSection} />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  animatedContainer: {
    flex: 1,
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
  headerCard: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsIcon: {
    marginLeft: 8,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.underTheMoonlight.midnight,
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.underTheMoonlight.dusk,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  textInputSection: {
    marginBottom: 16,
  },
  toggleCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.underTheMoonlight.midnight,
    marginLeft: 12,
  },
  textInputCard: {
    borderRadius: 24,
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  textInputContainer: {
    padding: 24,
  },
  textInput: {
    fontSize: 16,
    color: Colors.underTheMoonlight.midnight,
    lineHeight: 24,
    minHeight: 100,
    marginBottom: 20,
    fontWeight: '500',
  },
  sendButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordSection: {
    alignItems: 'center',
  },
  recordLabel: {
    fontSize: 18,
    color: Colors.underTheMoonlight.midnight,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  lockIndicator: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lockCard: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  lockText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.midnight,
    marginLeft: 8,
    fontWeight: '500',
  },
  recordButtonContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  heroButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonShadow: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  heroButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
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
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
  },
  stopButtonCard: {
    position: 'absolute',
    top: -160,
    borderRadius: 28,
    overflow: 'hidden',
  },
  stopButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingStatusCard: {
    marginTop: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    marginRight: 12,
    shadowColor: '#FF5252',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  recordingTime: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.underTheMoonlight.midnight,
    letterSpacing: -0.3,
  },
  lockedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingLeft: 20,
    borderLeftWidth: 1.5,
    borderLeftColor: Colors.underTheMoonlight.twilight,
  },
  lockedText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.midnight,
    marginLeft: 8,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});