import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
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
} from "lucide-react-native";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";


// Web-style constants - fixed values only
const RECORD_BUTTON = {
  size: 160,
  borderRadius: 90,
  iconSize: 72,
};

export default function InterpretScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dreamText, setDreamText] = useState("");
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


    console.log("Recording started...");
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

      console.log("Recording ended...");
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

    console.log("Recording locked...");
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

    console.log("Locked recording stopped...");
  };

  // Pan gesture handler for slide-up-to-lock
  const handlePanGesture = (event: any) => {
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
        Alert.alert("Dream Interpretation", "Your dream has been processed!");
        setDreamText("");
      }, 2000);
    }
  };

  // Handle tab swipe navigation
  const handleTabSwipe = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent;

    // Only handle gesture end
    if (state !== State.END) return;

    const swipeThreshold = 100;
    const velocityThreshold = 800;

    // Swipe right -> go to library (previous tab)
    if (translationX > swipeThreshold || velocityX > velocityThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      } else {
        Vibration.vibrate(20);
      }
      router.push("/(tabs)/library");
    }
    // Swipe left -> go to profile (next tab)
    else if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      } else {
        Vibration.vibrate(20);
      }
      router.push("/(tabs)/profile");
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={[styles.headerContent, { backgroundColor: "transparent" }]}>
        <Sparkles size={32} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.appTitle}>DreamTalk</Text>
        <Text style={styles.tagline}>
          Share your dreams, discover their meanings
        </Text>
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
          {showTextInput ? "Hide Text Input" : "Type Instead"}
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
              (!dreamText.trim() || isProcessing) && styles.sendButtonDisabled,
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
        style={[styles.lockIndicator, { opacity: lockIndicatorOpacity }]}
      >
        <ArrowUp size={24} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.lockText}>Slide up to lock</Text>
      </Animated.View>

      {/* Hero record button with enhanced design */}
      <View style={styles.recordButtonContainer}>
        <PanGestureHandler
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
                  { translateY: slideUpY },
                ],
              },
            ]}
          >
            <View style={styles.heroButtonShadow}>
              <LinearGradient
                colors={[
                  Colors.underTheMoonlight.midnight,
                  Colors.underTheMoonlight.dusk,
                ]}
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
                      <Mic size={RECORD_BUTTON.iconSize} color="#FFFFFF" strokeWidth={2.5} />
                      <View style={styles.recordingPulse} />
                    </View>
                  ) : (
                    <Mic size={RECORD_BUTTON.iconSize} color="#FFFFFF" strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </View>
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
            {Math.floor(recordingTime / 60)}:
            {(recordingTime % 60).toString().padStart(2, "0")}
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
        <PanGestureHandler
          onHandlerStateChange={handleTabSwipe}
          minDist={50}
          shouldCancelWhenOutside={true}
        >
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.topSection}>
              {renderHeader()}
              {renderTextInput()}
            </View>

            <View style={styles.centerSection}>{renderRecordButton()}</View>

            <View style={styles.bottomSection} />
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.underTheMoonlight.moonlight,
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -40, // Pull record button closer to text area
  },
  bottomSection: {
    height: 100, // Space for tabbar
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  textInputSection: {
    marginBottom: 8, // Reduce space after text input
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 12,
  },
  textInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    minHeight: 100,
  },
  sendButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  sendButtonDisabled: {
    backgroundColor: "#CCC",
  },
  recordSection: {
    alignItems: "center",
  },
  recordLabel: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20, // More space for better visual hierarchy
    textAlign: "center",
  },
  lockIndicator: {
    alignItems: "center",
    marginBottom: 16,
  },
  lockText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    marginTop: 4,
  },
  recordButtonContainer: {
    alignItems: "center",
    position: "relative",
  },
  heroButton: {
    width: RECORD_BUTTON.size,
    height: RECORD_BUTTON.size,
    borderRadius: RECORD_BUTTON.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  heroButtonShadow: {
    width: "100%",
    height: "100%",
    borderRadius: RECORD_BUTTON.borderRadius,
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 20,
  },
  heroButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: RECORD_BUTTON.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  recordButtonTouch: {
    width: "100%",
    height: "100%",
    borderRadius: RECORD_BUTTON.borderRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingIndicator: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  recordingPulse: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  stopButton: {
    position: "absolute",
    top: -140,
    backgroundColor: "#FFFFFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  recordingStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF5252",
    marginRight: 12,
    shadowColor: "#FF5252",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lockedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
  },
  lockedText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 4,
    fontWeight: "500",
  },
});
