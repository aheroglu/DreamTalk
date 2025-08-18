import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";

import { Text, View } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import {
  Sparkles,
  Mic,
  Brain,
  Moon,
  ChevronRight,
  ArrowRight,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
import { useOnboarding } from "@/hooks/useOnboarding";
// Web için PagerView alternatifi
import { ScrollView } from "react-native";
import { BlurView } from "expo-blur";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Modern arkaplan desenleri için yardımcı bileşenler
const BackgroundPattern = ({
  pattern,
  opacity = 0.1,
}: {
  pattern: string;
  opacity?: number;
}) => {
  const renderPattern = () => {
    switch (pattern) {
      case "circles":
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.circle,
                  {
                    top: Math.random() * screenHeight,
                    left: Math.random() * screenWidth,
                    width: 50 + Math.random() * 100,
                    height: 50 + Math.random() * 100,
                  },
                ]}
              />
            ))}
          </View>
        );
      case "waves":
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            <View style={styles.wave1} />
            <View style={styles.wave2} />
          </View>
        );
      case "dots":
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  {
                    top: Math.random() * screenHeight,
                    left: Math.random() * screenWidth,
                  },
                ]}
              />
            ))}
          </View>
        );
      case "stars":
        return (
          <View style={[styles.patternContainer, { opacity }]}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.star,
                  {
                    top: Math.random() * screenHeight,
                    left: Math.random() * screenWidth,
                  },
                ]}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return renderPattern();
};

// Onboarding sayfalarının içeriği
const onboardingData = [
  {
    id: 1,
    icon: Moon,
    title: "Welcome to DreamTalk",
    subtitle: "Your Personal Dream Interpreter",
    description:
      "Discover the hidden meanings behind your dreams with AI-powered interpretation and voice-first experience.",
    color: Colors.underTheMoonlight.dusk,
    gradient: ["#667eea" as const, "#764ba2" as const],
    bgPattern: "circles",
  },
  {
    id: 2,
    icon: Mic,
    title: "Voice-First Experience",
    subtitle: "Just Speak Your Dreams",
    description:
      "Simply hold the record button and tell us about your dream. Our AI listens and understands your stories naturally.",
    color: Colors.underTheMoonlight.midnight,
    gradient: ["#f093fb" as const, "#f5576c" as const],
    bgPattern: "waves",
  },
  {
    id: 3,
    icon: Brain,
    title: "AI-Powered Analysis",
    subtitle: "Deep Dream Understanding",
    description:
      "Our advanced AI analyzes symbols, emotions, and patterns in your dreams to provide meaningful interpretations.",
    color: Colors.underTheMoonlight.dusk,
    gradient: ["#4facfe" as const, "#00f2fe" as const],
    bgPattern: "dots",
  },
  {
    id: 4,
    icon: Sparkles,
    title: "Ready to Begin?",
    subtitle: "Your Dream Journey Starts Here",
    description:
      "Create your account and start exploring the fascinating world of your subconscious mind.",
    color: Colors.underTheMoonlight.midnight,
    gradient: ["#43e97b" as const, "#38f9d7" as const],
    bgPattern: "stars",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useOnboarding();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    // Initial animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    // Enhanced haptic feedback
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentPage < onboardingData.length - 1) {
      // Content fade-out animation before transition
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        
        // Smooth scroll with custom timing
        scrollRef.current?.scrollTo({
          x: nextPage * screenWidth,
          animated: true,
        });

        // Content fade-in after transition
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          ]).start();
        }, 200);
      });
    } else {
      // Son sayfada - Onboarding tamamlandı, Sign In'e git
      completeOnboarding();
      router.replace("/auth/signin");
    }
  };

  const handleSkip = () => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }
    // Skip onboarding - mark as completed
    completeOnboarding();
    router.replace("/auth/signin");
  };

  const renderPage = (item: (typeof onboardingData)[0], index: number) => {
    const IconComponent = item.icon;
    const isLastPage = index === onboardingData.length - 1;

    return (
      <LinearGradient
        key={item.id}
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.page}
      >
        {/* Arkaplan Deseni */}
        <BackgroundPattern pattern={item.bgPattern} opacity={0.15} />

        {/* Blur Overlay */}
        <View style={styles.blurOverlay} />

        <View
          style={[styles.iconContainer, { backgroundColor: "transparent" }]}
        >
          <Animated.View
            style={[
              styles.modernIconContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim,
              },
            ]}
          >
            <View style={styles.iconGlow}>
              <IconComponent size={60} color="#FFFFFF" strokeWidth={1.5} />
            </View>
          </Animated.View>
        </View>

        <View style={[styles.content, { backgroundColor: "transparent" }]}>
          <Text style={styles.modernTitle}>{item.title}</Text>
          <Text style={styles.modernSubtitle}>{item.subtitle}</Text>
          <Text style={styles.modernDescription}>{item.description}</Text>
        </View>

        <View
          style={[styles.actionContainer, { backgroundColor: "transparent" }]}
        >
          {/* Modern Pagination Dots */}
          <View
            style={[
              styles.modernPaginationContainer,
              { backgroundColor: "transparent" },
            ]}
          >
            {onboardingData.map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.modernPaginationDot,
                  {
                    backgroundColor:
                      index === currentPage
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.3)",
                    width: index === currentPage ? 24 : 8,
                    transform: [
                      {
                        scale:
                          index === currentPage
                            ? scaleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.1],
                              })
                            : 1,
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View
            style={[
              styles.buttonContainer,
              { backgroundColor: "transparent" },
              isLastPage && styles.buttonContainerCentered
            ]}
          >
            {!isLastPage && (
              <TouchableOpacity
                style={styles.modernSkipButton}
                onPress={handleSkip}
                activeOpacity={0.7}
              >
                <Text style={styles.modernSkipButtonText}>Skip</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modernButtonContainer}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  isLastPage
                    ? ["#667eea", "#764ba2"]
                    : ["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modernButton}
              >
                <Text style={styles.modernButtonText}>
                  {isLastPage ? "Get Started" : "Next"}
                </Text>
                {!isLastPage && (
                  <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                )}
                {isLastPage && (
                  <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={[Colors.underTheMoonlight.moonlight, "#F8F8FF"]}
        style={[styles.container, { backgroundColor: "transparent" }]}
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
          <ScrollView
            ref={scrollRef}
            style={styles.pagerView}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const page = Math.round(
                event.nativeEvent.contentOffset.x / screenWidth
              );
              setCurrentPage(page);
            }}
          >
            {onboardingData.map((item, index) => (
              <View
                key={item.id}
                style={[styles.pageContainer, { width: screenWidth }]}
              >
                {renderPage(item, index)}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  animatedContainer: {
    flex: 1,
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 40,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  content: {
    flex: 2,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.underTheMoonlight.dusk,
    textAlign: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  actionContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    gap: 8,
  },
  modernPaginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  modernPaginationDot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  modernIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  iconGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  modernTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modernDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  patternContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 999,
  },
  wave1: {
    position: "absolute",
    top: "20%",
    left: "-50%",
    width: screenWidth * 2,
    height: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 100,
    transform: [{ rotate: "15deg" }],
  },
  wave2: {
    position: "absolute",
    bottom: "20%",
    right: "-50%",
    width: screenWidth * 2,
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 75,
    transform: [{ rotate: "-15deg" }],
  },
  dot: {
    position: "absolute",
    width: 6,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
  },
  star: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonContainerCentered: {
    justifyContent: "center",
  },
  modernSkipButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  modernSkipButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  modernButtonContainer: {
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  modernButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  modernButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
