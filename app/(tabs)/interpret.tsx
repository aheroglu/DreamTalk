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
import { useAudioRecording } from "@/hooks/useAudioRecording";

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

  // Timer and recording time state (no longer needed - using audioRecording duration)
  // const [recordingTime, setRecordingTime] = useState(0);

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

  // Audio recording hook
  const {
    isRecording: audioIsRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    cancelRecording,
    formatDuration: audioFormatDuration,
  } = useAudioRecording();

  const [dreamText, setDreamText] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Timer reference no longer needed - using audio recording hook duration

  // Recorded audio state
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);

  // Modal states
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [showInterpretationModal, setShowInterpretationModal] = useState(false);

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
        // Reset states when leaving the page
        setIsRecording(false);
        // Audio recording cleanup is handled by the hook
      };
    }, [fadeAnim])
  );

  // Helper function no longer needed - using audioFormatDuration from hook

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

    // Start actual audio recording
    const recordingStarted = await startRecording();
    if (!recordingStarted) {
      console.log("Failed to start audio recording");
      Alert.alert("Hata", "Ses kaydı başlatılamadı. Lütfen tekrar deneyin.");
      return;
    }

    setIsRecording(true);
    setIsGestureActive(false);
    setRecordedAudio(null); // Clear any previous recording

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

    handleStopRecording();
  };

  const handleStopRecording = async () => {
    console.log(`Recording stopped after ${recordingDuration} seconds`);

    try {
      // Stop actual audio recording
      const result = await stopRecording();

      if (result && result.uri) {
        setRecordedAudio(result.uri);
        console.log("Audio recorded successfully:", result);

        // Show audio modal instead of alert
        setShowAudioModal(true);
      } else {
        console.log("Recording failed or no audio data");
        Alert.alert("Hata", "Ses kaydı alınamadı. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Hata", "Ses kaydını durdururken bir hata oluştu.");
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
    await handleStopRecording();
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
          // Success - show interpretation modal
          setShowInterpretationModal(true);
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
                            {audioFormatDuration(recordingDuration)}
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

              {/* Content sections removed - using modals instead */}
              {false && (
                <View style={styles.audioSection}>
                  <View style={styles.audioCard}>
                    <Text style={styles.audioTitle}>Ses Kaydınız Hazır</Text>
                    <Text style={styles.audioDescription}>
                      Rüya yorumunuzu almak için ses kaydınızı işleme
                      alabilirsiniz.
                    </Text>
                    <TouchableOpacity
                      style={styles.processAudioButton}
                      onPress={() => {
                        // TODO: Process audio for dream interpretation
                        Alert.alert(
                          "Yakında",
                          "Ses dosyası işleme özelliği yakında eklenecek. Şimdilik metin ile rüya anlatımını kullanabilirsiniz."
                        );
                      }}
                    >
                      <Sparkles size={20} color="#FFFFFF" />
                      <Text style={styles.processAudioButtonText}>
                        Rüya Yorumunu Al
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.clearAudioButton}
                      onPress={() => setRecordedAudio(null)}
                    >
                      <Text style={styles.clearAudioButtonText}>
                        Yeni Kayıt Yap
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Dream Interpretation Results - moved to modal */}
              {false && (
                <View style={styles.interpretationSection}>
                  <View style={styles.interpretationHeader}>
                    <Sparkles size={24} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.interpretationTitle}>
                      Rüya Yorumunuz
                    </Text>
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
                            <Text style={styles.symbolName}>
                              {symbol.symbol}
                            </Text>
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
                    <Text style={styles.clearButtonText}>
                      Yeni Rüya Analizi
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Error Display - keeping for now */}
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

      {/* Audio Modal */}
      {showAudioModal && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowAudioModal(false)}
          />
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Sparkles size={28} color={Colors.underTheMoonlight.dusk} />
              <Text style={styles.modalTitle}>Ses Kaydınız Hazır</Text>
              <Text style={styles.modalDescription}>
                Rüya yorumunuzu almak için ses kaydınızı işleme alabilirsiniz.
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.primaryModalButton}
                  onPress={() => {
                    setShowAudioModal(false);
                    // TODO: Process audio for dream interpretation
                    Alert.alert(
                      "Yakında",
                      "Ses dosyası işleme özelliği yakında eklenecek. Şimdilik metin ile rüya anlatımını kullanabilirsiniz."
                    );
                  }}
                >
                  <Sparkles size={20} color="#FFFFFF" />
                  <Text style={styles.primaryModalButtonText}>
                    Rüya Yorumunu Al
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryModalButton}
                  onPress={() => {
                    setShowAudioModal(false);
                    setRecordedAudio(null);
                  }}
                >
                  <Text style={styles.secondaryModalButtonText}>
                    Yeni Kayıt Yap
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Interpretation Modal */}
      {showInterpretationModal && interpretation && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowInterpretationModal(false)}
          />
          <View style={styles.modalContainer}>
            <View
              style={[styles.modalContent, styles.interpretationModalContent]}
            >
              <View style={styles.modalHeader}>
                <Sparkles size={24} color={Colors.underTheMoonlight.dusk} />
                <Text style={styles.modalTitle}>Rüya Yorumunuz</Text>
              </View>

              <View style={styles.interpretationScrollContent}>
                {/* Summary */}
                <View style={styles.summarySection}>
                  <Text style={styles.summaryTitle}>Özet</Text>
                  <Text style={styles.summaryText}>
                    {interpretation.summary}
                  </Text>
                </View>

                {/* Detailed Interpretation */}
                <View style={styles.interpretationSection}>
                  <Text style={styles.sectionTitle}>Detaylı Yorum</Text>
                  <Text style={styles.interpretationText}>
                    {interpretation.interpretation}
                  </Text>
                </View>

                {/* Symbols */}
                {interpretation.symbols &&
                  interpretation.symbols.length > 0 && (
                    <View style={styles.symbolsSection}>
                      <Text style={styles.sectionTitle}>Semboller</Text>
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
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.primaryModalButton}
                  onPress={() => {
                    setShowInterpretationModal(false);
                    clearInterpretation();
                  }}
                >
                  <Text style={styles.primaryModalButtonText}>
                    Yeni Rüya Analizi
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryModalButton}
                  onPress={() => setShowInterpretationModal(false)}
                >
                  <Text style={styles.secondaryModalButtonText}>Kapat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
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
    backgroundColor: "transparent",
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
    backgroundColor: "transparent",
    gap: LAYOUT.spacing.element,
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
  },
  lockIndicator: {
    position: "absolute",
    top: -100,
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
    backgroundColor: "transparent",
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
    top: LAYOUT.recordButton.size + 50, // Full button height + 20px gap
    width: "100%",
    backgroundColor: "transparent",
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

  // Audio Section Styles
  audioSection: {
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
    marginTop: LAYOUT.spacing.section,
    backgroundColor: "transparent",
  },
  audioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    alignItems: "center",
    gap: 16,
  },
  audioTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
    textAlign: "center",
  },
  audioDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  processAudioButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  processAudioButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  clearAudioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAudioButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  // Bottom Spacer - CSS Grid: Fixed height for tabbar
  bottomSpacer: {
    backgroundColor: "transparent",
    height: 100,
  },

  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    backgroundColor: "transparent",
    borderRadius: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  interpretationModalContent: {
    maxHeight: "80%",
    alignItems: "stretch",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    width: "100%",
    backgroundColor: "transparent",
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryModalButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: Colors.underTheMoonlight.midnight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryModalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryModalButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryModalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  // Interpretation Modal Content
  interpretationScrollContent: {
    flex: 1,
    width: "100%",
  },
  summarySection: {
    marginBottom: 20,
  },
  symbolsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.underTheMoonlight.midnight,
    marginBottom: 12,
  },
});
