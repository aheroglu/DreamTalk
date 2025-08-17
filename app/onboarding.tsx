import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "@/components/Themed";
import { LinearGradient } from "expo-linear-gradient";
import { 
  Sparkles, 
  Mic, 
  Brain, 
  Moon, 
  ChevronRight,
  ArrowRight 
} from "lucide-react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/Colors";
// Web için PagerView alternatifi
import { ScrollView } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Onboarding sayfalarının içeriği
const onboardingData = [
  {
    id: 1,
    icon: Moon,
    title: "Welcome to DreamTalk",
    subtitle: "Your Personal Dream Interpreter",
    description: "Discover the hidden meanings behind your dreams with AI-powered interpretation and voice-first experience.",
    color: Colors.underTheMoonlight.dusk,
  },
  {
    id: 2,
    icon: Mic,
    title: "Voice-First Experience",
    subtitle: "Just Speak Your Dreams",
    description: "Simply hold the record button and tell us about your dream. Our AI listens and understands your stories naturally.",
    color: Colors.underTheMoonlight.midnight,
  },
  {
    id: 3,
    icon: Brain,
    title: "AI-Powered Analysis",
    subtitle: "Deep Dream Understanding",
    description: "Our advanced AI analyzes symbols, emotions, and patterns in your dreams to provide meaningful interpretations.",
    color: Colors.underTheMoonlight.dusk,
  },
  {
    id: 4,
    icon: Sparkles,
    title: "Ready to Begin?",
    subtitle: "Your Dream Journey Starts Here",
    description: "Create your account and start exploring the fascinating world of your subconscious mind.",
    color: Colors.underTheMoonlight.midnight,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
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
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }

    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      // Scroll to next page
      scrollRef.current?.scrollTo({ x: nextPage * screenWidth, animated: true });
    } else {
      // Son sayfada - Sign In'e git
      router.push("/auth/signin");
    }
  };

  const handleSkip = () => {
    if (Platform.OS === "ios") {
      Haptics.selectionAsync();
    }
    router.push("/auth/signin");
  };


  const renderPage = (item: typeof onboardingData[0], index: number) => {
    const IconComponent = item.icon;
    const isLastPage = index === onboardingData.length - 1;

    return (
      <View key={item.id} style={styles.page}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
            <IconComponent size={64} color="#FFFFFF" strokeWidth={2} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.actionContainer}>
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {onboardingData.map((_, dotIndex) => (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      dotIndex === currentPage
                        ? Colors.underTheMoonlight.midnight
                        : "rgba(0,0,0,0.2)",
                    width: dotIndex === currentPage ? 24 : 8,
                  },
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!isLastPage && (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.nextButton,
                { backgroundColor: item.color },
                isLastPage && styles.getStartedButton,
              ]}
              onPress={handleNext}
            >
              <Text style={styles.nextText}>
                {isLastPage ? "Get Started" : "Next"}
              </Text>
              {!isLastPage && (
                <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
              )}
              {isLastPage && (
                <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={[Colors.underTheMoonlight.moonlight, "#F8F8FF"]}
        style={styles.container}
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
              const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
              setCurrentPage(page);
            }}
          >
            {onboardingData.map((item, index) => (
              <View key={item.id} style={[styles.pageContainer, { width: screenWidth }]}>
                {renderPage(item, index)}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButton: {
    paddingHorizontal: 40,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});