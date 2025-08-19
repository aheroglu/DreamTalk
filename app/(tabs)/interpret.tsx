import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Vibration,
  Alert,
  Platform,
  Dimensions,
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
  Sparkles,
  Type,
  Send,
  Loader,
  ArrowUp,
  Lock,
  MicOff,
} from "lucide-react-native";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDreamInterpretation } from "@/hooks/useDreamInterpretation";
import { useAudioPermissions } from "@/hooks/useAudioPermissions";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Calculate dynamic button size based on screen width percentage
const getButtonSize = () => {
  // Button size as percentage of screen width (more universal approach)
  const buttonPercentage = 0.35; // 35% of screen width
  const minButtonSize = 100; // Minimum button size for very small screens
  const maxButtonSize = 160; // Maximum button size for very large screens

  const calculatedSize = screenWidth * buttonPercentage;
  return Math.max(minButtonSize, Math.min(maxButtonSize, calculatedSize));
};

const BUTTON_SIZE = getButtonSize();
const ICON_SIZE = BUTTON_SIZE * 0.34; // Keep icon proportional to button

// Modern CSS Grid approach - Dynamic values based on screen size
const LAYOUT = {
  container: {
    paddingHorizontal: 20,
    paddingTop: 10, // Reduced from 20 to 10
  },
  header: {
    marginBottom: 32,
  },
  recordButton: {
    size: BUTTON_SIZE,
    iconSize: ICON_SIZE,
  },
  spacing: {
    section: 40,
    element: 16,
  },
};

export default function InterpretScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Simple recording state (we'll implement step by step)
  const [isRecording, setIsRecording] = useState(false);

  // Glow animation for record button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Timer and recording time state
  const [recordingTime, setRecordingTime] = useState(0);

  // Dream interpretation hook
  const {
    isLoading: isInterpreting,
    interpretation,
    error: interpretationError,
    interpretDream,
    clearInterpretation,
    clearError,
  } = useDreamInterpretation();

  // Audio permissions hook
  const { hasPermission, isRequesting, requestPermissions, resetPermissions } =
    useAudioPermissions();

  const [dreamText, setDreamText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Timer reference for recording
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simple fade animation for the page
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Permissions will be requested when user tries to record

  // Start glow animation when component mounts
  useEffect(() => {
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    glowAnimation.start();

    return () => glowAnimation.stop();
  }, [pulseAnim]);

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
        // Clear timer and reset states when leaving the page
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setIsRecording(false);
        setRecordingTime(0);
      };
    }, [fadeAnim])
  );

  // Helper function to format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Add gesture tracking state
  const [isGestureActive, setIsGestureActive] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);

  // Record handlers
  const handleRecordStart = async () => {
    console.log("Record button pressed");

    // Don't start if already locked
    if (isLocked) {
      return;
    }

    // Check permissions first
    if (hasPermission === false) {
      console.log("No permission, requesting...");
      const granted = await requestPermissions();
      if (!granted) {
        console.log("Permission denied, aborting recording");
        return;
      }
    } else if (hasPermission === null) {
      console.log("Permission unknown, requesting...");
      const granted = await requestPermissions();
      if (!granted) {
        return;
      }
    }

    console.log("Permission granted, starting recording...");
    setIsRecording(true);
    setIsGestureActive(false);

    // Clear any existing timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Start timer
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    // Simple haptic feedback
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Vibration.vibrate(50);
    }

    console.log("Recording started successfully");
  };

  const handleRecordEnd = async () => {
    console.log("Record button released");

    if (!isRecording) {
      console.log("Not recording, nothing to stop");
      return;
    }

    // Don't stop if recording is locked
    if (isLocked) {
      console.log("Recording is locked, ignoring button release");
      return;
    }

    stopRecording();
  };

  const stopRecording = () => {
    console.log(`Recording stopped after ${recordingTime} seconds`);

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setIsLocked(false);

    // Show success feedback
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Slide to lock functionality
  const handleSlideUpToLock = () => {
    if (!isRecording || isLocked) return;

    console.log("🔒 Recording locked");
    setIsLocked(true);

    // Strong haptic feedback
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } else {
      Vibration.vibrate(100);
    }
  };

  const handleStopLockedRecording = async () => {
    console.log("Stopping locked recording");
    stopRecording();
  };

  const handlePanGesture = (event: any) => {
    const { translationY } = event.nativeEvent;

    if (isRecording && !isLocked) {
      // Calculate slide progress (0 to 1) - trigger at 80px
      const progress = Math.max(0, Math.min(1, Math.abs(translationY) / 80));
      setSlideProgress(progress);

      // Check if we should trigger lock (swipe up 80+ pixels)
      if (translationY < -80) {
        handleSlideUpToLock();
      }
    }
  };

  const handlePanStateChange = (event: any) => {
    const { state, translationY } = event.nativeEvent;

    if (state === State.BEGAN) {
      setIsGestureActive(true);
      setSlideProgress(0);
    } else if (
      state === State.END ||
      state === State.CANCELLED ||
      state === State.FAILED
    ) {
      setIsGestureActive(false);
      setSlideProgress(0);

      // Only stop recording if gesture ended without lock and we're recording
      if (isRecording && !isLocked) {
        // Small delay to prevent conflicts with TouchableOpacity
        setTimeout(() => {
          if (isRecording && !isLocked) {
            handleRecordEnd();
          }
        }, 50);
      }
    }
  };

  // Text submission
  const handleSendText = async () => {
    if (dreamText.trim()) {
      setIsProcessing(true);
      clearError(); // Clear any previous errors

      try {
        const result = await interpretDream({
          dreamText: dreamText.trim(),
        });

        if (result) {
          // Success - the interpretation is now available in the hook
          Alert.alert(
            "Rüya Yorumu Hazır",
            "Rüyanız başarıyla analiz edildi! Yorumu görmek için aşağıdaki sonuçları inceleyin.",
            [{ text: "Tamam" }]
          );
        } else {
          // Handle case where interpretation failed
          Alert.alert(
            "Hata",
            interpretationError ||
              "Rüya yorumu yapılırken bir hata oluştu. Lütfen tekrar deneyin.",
            [{ text: "Tamam" }]
          );
        }
      } catch (error) {
        Alert.alert(
          "Hata",
          "Bir sorun oluştu. İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
          [{ text: "Tamam" }]
        );
      } finally {
        setIsProcessing(false);
        setDreamText("");
      }
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

              {/* Text Input Section - Hidden during recording */}
              {!isRecording && (
                <>
                  {/* Text Input Toggle */}
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      showTextInput && styles.toggleButtonActive,
                    ]}
                    onPress={() => setShowTextInput(!showTextInput)}
                  >
                    <Type
                      size={20}
                      color={
                        showTextInput
                          ? "#FFFFFF"
                          : Colors.underTheMoonlight.dusk
                      }
                    />
                    <Text
                      style={[
                        styles.toggleText,
                        showTextInput && styles.toggleTextActive,
                      ]}
                    >
                      {showTextInput ? "Metni Gizle" : "Metin Yaz"}
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
                          (!dreamText.trim() ||
                            isProcessing ||
                            isInterpreting) &&
                            styles.sendButtonDisabled,
                        ]}
                        onPress={handleSendText}
                        disabled={
                          !dreamText.trim() || isProcessing || isInterpreting
                        }
                      >
                        {isProcessing || isInterpreting ? (
                          <Loader size={20} color="#FFFFFF" />
                        ) : (
                          <Send size={20} color="#FFFFFF" />
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Center Record Section - Hidden when text input is active */}
            {!showTextInput && (
              <View style={styles.recordSection}>
                {/* Record Button with Glow Effect */}
                <View style={styles.recordButtonContainer}>
                  {/* Glow Effect Layers */}
                  <Animated.View
                    style={[
                      styles.glowOuter,
                      {
                        backgroundColor: Colors.underTheMoonlight.midnight,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.glowMiddle,
                      {
                        backgroundColor: Colors.underTheMoonlight.midnight,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.glowInner,
                      {
                        backgroundColor: Colors.underTheMoonlight.midnight,
                        transform: [{ scale: pulseAnim }],
                      },
                    ]}
                  />

                  {/* Lock Indicator */}
                  {isRecording && !isLocked && (
                    <Animated.View
                      style={[
                        styles.lockIndicator,
                        {
                          opacity: 0.7 + slideProgress * 0.3,
                          transform: [{ scale: 0.9 + slideProgress * 0.1 }],
                        },
                      ]}
                    >
                      <ArrowUp
                        size={20}
                        color={Colors.underTheMoonlight.dusk}
                      />
                      <Text style={styles.lockText}>Slide up to lock</Text>
                      {slideProgress > 0 && (
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${slideProgress * 100}%` },
                          ]}
                        />
                      )}
                    </Animated.View>
                  )}

                  <PanGestureHandler
                    minDist={5}
                    onGestureEvent={handlePanGesture}
                    onHandlerStateChange={handlePanStateChange}
                    enabled={true}
                    shouldCancelWhenOutside={false}
                  >
                    <TouchableOpacity
                      style={[
                        styles.recordButton,
                        isRecording && styles.recordButtonActive,
                      ]}
                      onPressIn={handleRecordStart}
                      onPressOut={
                        !isGestureActive && isRecording && !isLocked
                          ? handleRecordEnd
                          : undefined
                      }
                      activeOpacity={0.9}
                      disabled={isLocked}
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
                        <Mic
                          size={LAYOUT.recordButton.iconSize}
                          color="#FFFFFF"
                          strokeWidth={2}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
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

                  {/* Recording Status with Timer */}
                  {isRecording && (
                    <View style={styles.recordingStatusContainer}>
                      <View style={styles.recordingStatus}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingTime}>
                          {formatTime(recordingTime)}
                        </Text>
                        {isLocked && (
                          <View style={styles.lockedIndicator}>
                            <Lock
                              size={16}
                              color={Colors.underTheMoonlight.dusk}
                            />
                            <Text style={styles.lockedText}>Locked</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Dream Interpretation Results */}
            {interpretation && (
              <View style={styles.interpretationSection}>
                <View style={styles.interpretationHeader}>
                  <Sparkles size={24} color={Colors.underTheMoonlight.dusk} />
                  <Text style={styles.interpretationTitle}>Rüya Yorumunuz</Text>
                </View>

                {/* Summary */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Özet</Text>
                  <Text style={styles.summaryText}>
                    {interpretation.summary}
                  </Text>
                </View>

                {/* Detailed Interpretation */}
                <View style={styles.interpretationCard}>
                  <Text style={styles.cardTitle}>Detaylı Yorum</Text>
                  <Text style={styles.interpretationText}>
                    {interpretation.interpretation}
                  </Text>
                </View>

                {/* Symbols */}
                {interpretation.symbols &&
                  interpretation.symbols.length > 0 && (
                    <View style={styles.symbolsCard}>
                      <Text style={styles.cardTitle}>Semboller</Text>
                      {interpretation.symbols.map((symbol, index) => (
                        <View key={index} style={styles.symbolItem}>
                          <Text style={styles.symbolName}>{symbol.symbol}</Text>
                          <Text style={styles.symbolMeaning}>
                            {symbol.meaning}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                {/* Clear Button */}
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearInterpretation}
                >
                  <Text style={styles.clearButtonText}>Yeni Rüya Analizi</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Error Display */}
            {interpretationError && !interpretation && (
              <View style={styles.errorSection}>
                <View style={styles.errorCard}>
                  <Text style={styles.errorTitle}>Hata</Text>
                  <Text style={styles.errorText}>{interpretationError}</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={clearError}
                  >
                    <Text style={styles.retryButtonText}>Tekrar Dene</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

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
  toggleButtonActive: {
    backgroundColor: Colors.underTheMoonlight.midnight,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.underTheMoonlight.dusk,
    marginLeft: 12,
  },
  toggleTextActive: {
    color: "#FFFFFF",
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

  // Dream Interpretation Section
  interpretationSection: {
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
    marginTop: LAYOUT.spacing.section,
    gap: LAYOUT.spacing.element,
  },
  interpretationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  interpretationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.underTheMoonlight.midnight,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  interpretationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.underTheMoonlight.midnight,
    marginBottom: 12,
  },
  interpretationText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  symbolsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  symbolItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  symbolName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.underTheMoonlight.dusk,
    marginBottom: 4,
  },
  symbolMeaning: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Error Section
  errorSection: {
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
    marginTop: LAYOUT.spacing.section,
  },
  errorCard: {
    backgroundColor: "#FFE6E6",
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#D32F2F",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#B71C1C",
    lineHeight: 22,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#FF5252",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  // Record Section - CSS Grid: Flex 1 (takes remaining space)
  recordSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: LAYOUT.spacing.element,
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
  },
  lockIndicator: {
    position: "absolute",
    top: -90,
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
  },
  recordButtonContainer: {
    marginVertical: 32,
    alignItems: "center",
    position: "relative",
    paddingBottom: 60, // Space for recording status below
  },
  recordButton: {
    width: LAYOUT.recordButton.size,
    height: LAYOUT.recordButton.size,
    borderRadius: LAYOUT.recordButton.size / 2,
  },
  recordButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  recordButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: LAYOUT.recordButton.size / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  // Glow effect styles - Dynamic based on button size
  glowOuter: {
    position: "absolute",
    width: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.29, // ~40px for 140px button
    height: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.29,
    borderRadius:
      (LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.29) / 2,
    opacity: 0.15,
    top: -(LAYOUT.recordButton.size * 0.14), // ~-20px for 140px button
    left: -(LAYOUT.recordButton.size * 0.14),
  },
  glowMiddle: {
    position: "absolute",
    width: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.14, // ~20px for 140px button
    height: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.14,
    borderRadius:
      (LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.14) / 2,
    opacity: 0.25,
    top: -(LAYOUT.recordButton.size * 0.07), // ~-10px for 140px button
    left: -(LAYOUT.recordButton.size * 0.07),
  },
  glowInner: {
    position: "absolute",
    width: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.07, // ~10px for 140px button
    height: LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.07,
    borderRadius:
      (LAYOUT.recordButton.size + LAYOUT.recordButton.size * 0.07) / 2,
    opacity: 0.35,
    top: -(LAYOUT.recordButton.size * 0.036), // ~-5px for 140px button
    left: -(LAYOUT.recordButton.size * 0.036),
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
  recordingStatusContainer: {
    position: "absolute",
    top: LAYOUT.recordButton.size + 20, // Full button height + 20px gap
    width: "100%",
    alignItems: "center",
    zIndex: 10,
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
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    fontVariant: ["tabular-nums"],
  },
  recordingLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  // Locked indicator in recording status
  lockedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: "#E0E0E0",
    gap: 4,
    backgroundColor: "transparent",
  },
  lockedText: {
    fontSize: 14,
    color: Colors.underTheMoonlight.dusk,
    fontWeight: "500",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 8,
    height: 3,
    backgroundColor: Colors.underTheMoonlight.midnight,
    borderRadius: 1.5,
  },

  // Bottom Spacer - CSS Grid: Fixed height for tabbar
  bottomSpacer: {
    height: 100,
  },
});
