import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,

  TextInput,
  Animated,
  TouchableOpacity,
  Vibration,
  Alert,
  Platform,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "lucide-react-native";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

// Modern CSS Grid approach - Fixed, simple values
const LAYOUT = {
  container: {
    paddingHorizontal: 20,
    paddingTop: 10, // Reduced from 20 to 10
  },
  header: {
    marginBottom: 32,
  },
  recordButton: {
    size: 140,
    iconSize: 48,
  },
  spacing: {
    section: 40,
    element: 16,
  },
};

export default function InterpretScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dreamText, setDreamText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simple animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const recordButtonScale = useRef(new Animated.Value(1)).current;
  const lockIndicatorOpacity = useRef(new Animated.Value(0)).current;

  // Timer
  const timerRef = useRef<number | null>(null);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Simple page focus animation
  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      return () => {
        fadeAnim.setValue(0);
        // Clean up timer when leaving the page
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        // Reset recording state when leaving the page
        setIsRecording(false);
        setIsLocked(false);
        setRecordingTime(0);
      };
    }, [fadeAnim])
  );

  // Record handlers
  const handleRecordStart = () => {
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Simple scale animation
    Animated.spring(recordButtonScale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();

    // Show lock indicator
    Animated.timing(lockIndicatorOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Haptic feedback
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(50);
    }
  };

  const handleRecordEnd = () => {
    if (!isLocked) {
      setIsRecording(false);

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

      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleSlideUpToLock = () => {
    setIsLocked(true);

    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(100);
    }
  };

  const handleStopLockedRecording = () => {
    setIsRecording(false);
    setIsLocked(false);

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

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Slide to lock gesture
  const handlePanGesture = (event: any) => {
    const { translationY } = event.nativeEvent;

    if (isRecording && !isLocked) {
      if (translationY < -60) {
        handleSlideUpToLock();
      }
    }
  };

  const handlePanStateChange = (event: any) => {
    const { state } = event.nativeEvent;
    // Handle gesture state changes if needed
  };

  // Text submission
  const handleSendText = async () => {
    if (dreamText.trim()) {
      setIsProcessing(true);

      setTimeout(() => {
        setIsProcessing(false);
        Alert.alert("Dream Interpretation", "Your dream has been processed!");
        setDreamText("");
      }, 2000);
    }
  };

  // Tab swipe navigation
  const handleTabSwipe = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state !== State.END) return;

    const swipeThreshold = 100;

    if (translationX > swipeThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      }
      router.push("/(tabs)/library");
    } else if (translationX < -swipeThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      }
      router.push("/(tabs)/profile");
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[Colors.underTheMoonlight.moonlight, "#F8F8FF"]}
        style={styles.container}
      >
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
          <PanGestureHandler
            onHandlerStateChange={handleTabSwipe}
            minDist={50}
            shouldCancelWhenOutside={true}
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {/* Header Section */}
              <View style={styles.headerSection}>
                <View style={styles.headerContent}>
                  <Sparkles size={28} color={Colors.underTheMoonlight.dusk} />
                  <Text style={styles.title}>DreamTalk</Text>
                  <Text style={styles.subtitle}>
                    Share your dreams, discover their meanings
                  </Text>
                </View>

                {/* Text Input Toggle */}
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setShowTextInput(!showTextInput)}
                >
                  <Type size={20} color={Colors.underTheMoonlight.dusk} />
                  <Text style={styles.toggleText}>
                    {showTextInput ? "Hide Text Input" : "Type Instead"}
                  </Text>
                </TouchableOpacity>

                {/* Text Input */}
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
                        (!dreamText.trim() || isProcessing) &&
                          styles.sendButtonDisabled,
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

              {/* Center Record Section */}
              <View style={styles.recordSection}>
                <Text style={styles.recordLabel}>
                  Hold to Record Your Dream
                </Text>

                {/* Lock Indicator */}
                <Animated.View
                  style={[
                    styles.lockIndicator,
                    { opacity: lockIndicatorOpacity },
                  ]}
                >
                  <ArrowUp size={20} color={Colors.underTheMoonlight.dusk} />
                  <Text style={styles.lockText}>Slide up to lock</Text>
                </Animated.View>

                {/* Record Button */}
                <View style={styles.recordButtonContainer}>
                  <PanGestureHandler
                    onGestureEvent={handlePanGesture}
                    onHandlerStateChange={handlePanStateChange}
                    enabled={isRecording && !isLocked}
                  >
                    <Animated.View
                      style={[
                        styles.recordButton,
                        { transform: [{ scale: recordButtonScale }] },
                      ]}
                    >
                      <LinearGradient
                        colors={[
                          Colors.underTheMoonlight.midnight,
                          Colors.underTheMoonlight.dusk,
                        ]}
                        style={styles.recordButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <TouchableOpacity
                          style={styles.recordButtonTouch}
                          onPressIn={handleRecordStart}
                          onPressOut={handleRecordEnd}
                          activeOpacity={0.9}
                        >
                          <Mic
                            size={LAYOUT.recordButton.iconSize}
                            color="#FFFFFF"
                            strokeWidth={2}
                          />
                        </TouchableOpacity>
                      </LinearGradient>
                    </Animated.View>
                  </PanGestureHandler>

                  {/* Stop Button for Locked Recording */}
                  {isLocked && (
                    <TouchableOpacity
                      style={styles.stopButton}
                      onPress={handleStopLockedRecording}
                    >
                      <MicOff
                        size={24}
                        color={Colors.underTheMoonlight.midnight}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Recording Status */}
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

              {/* Bottom Spacer */}
              <View
                style={[styles.bottomSpacer, { height: 100 + insets.bottom }]}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },

  // Header Section - CSS Grid: Auto height
  headerSection: {
    gap: LAYOUT.spacing.element,
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
    paddingTop: LAYOUT.container.paddingTop,
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
    marginBottom: LAYOUT.spacing.element,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  // Text Input Section
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 12,
  },
  textInputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  textInput: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    minHeight: 80,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  sendButtonDisabled: {
    backgroundColor: "#CCC",
  },

  // Record Section - CSS Grid: Flex 1 (takes remaining space)
  recordSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: LAYOUT.spacing.element,
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
  },
  recordLabel: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  lockIndicator: {
    alignItems: "center",
    gap: 4,
  },
  lockText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
  },
  recordButtonContainer: {
    alignItems: "center",
    position: "relative",
  },
  recordButton: {
    width: LAYOUT.recordButton.size,
    height: LAYOUT.recordButton.size,
    borderRadius: LAYOUT.recordButton.size / 2,
  },
  recordButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: LAYOUT.recordButton.size / 2,
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  recordButtonTouch: {
    width: "100%",
    height: "100%",
    borderRadius: LAYOUT.recordButton.size / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stopButton: {
    position: "absolute",
    top: -80,
    backgroundColor: "#FFFFFF",
    width: 48,
    height: 48,
    borderRadius: 24,
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
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF5252",
  },
  recordingTime: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  lockedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
    gap: 4,
  },
  lockedText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    fontWeight: "500",
  },

  // Bottom Spacer - CSS Grid: Fixed height for tabbar
  bottomSpacer: {
    height: 100,
  },
});
