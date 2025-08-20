import React, { useEffect, useRef } from "react";
import { Tabs, useRouter, useSegments } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Animated,
  Vibration,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BookOpen, Mic, User } from "lucide-react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

// Web-style constants - no complexity, just fixed values
const STYLES = {
  tabBar: {
    height: 70,
    bottom: 40,
    marginHorizontal: 30,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  icon: {
    containerSize: 50,
    size: 24,
  },
  cta: {
    size: 64,
    borderRadius: 39,
    borderWidth: 4,
    iconSize: 32,
  },
  glow: {
    outer: 110,
    middle: 95,
    inner: 85,
  },
};

// HapticTab component for native haptic feedback
const HapticTab = ({ children, onPress, ...props }: any) => (
  <TouchableOpacity
    {...props}
    onPress={(e) => {
      // Native haptic feedback like iOS tabs
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      } else {
        Vibration.vibrate(20);
      }
      onPress && onPress(e);
    }}
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </TouchableOpacity>
);

// Enhanced HapticTab for CTA button
const EnhancedHapticTab = ({ children, onPress, ...props }: any) => (
  <TouchableOpacity
    {...props}
    onPress={(e) => {
      // Enhanced haptic feedback for CTA button
      if (Platform.OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Vibration.vibrate(50);
      }
      onPress && onPress(e);
    }}
    style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </TouchableOpacity>
);

// Custom tab bar icons using Lucide
function TabBarIcon({
  icon: Icon,
  color,
  focused,
  size = STYLES.icon.size,
}: {
  icon: any;
  color: string;
  focused: boolean;
  size?: number;
}) {
  return (
    <View
      style={[styles.iconContainer, focused && styles.iconContainerFocused]}
    >
      <Icon size={size} color={color} />
    </View>
  );
}

// Special CTA tab for the center interpret button with magical glow
function CTATabIcon({ color, focused }: { color: string; focused: boolean }) {
  const colorScheme = useColorScheme();
  const ctaColor = focused
    ? Colors[colorScheme ?? "light"].primary
    : Colors[colorScheme ?? "light"].primary;

  // Animation for pulsing glow effect - only when NOT focused
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!focused) {
      // Show glow animation when NOT on interpret page
      const pulseAnimation = Animated.loop(
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

      pulseAnimation.start();
      return () => pulseAnimation.stop();
    } else {
      // Stop animation and reset scale when on interpret page
      pulseAnim.setValue(1);
    }
  }, [pulseAnim, focused]);

  // If focused (on interpret page), render as normal tab
  if (focused) {
    return (
      <View style={[styles.iconContainer, styles.iconContainerFocused]}>
        <Mic size={24} color={color} />
      </View>
    );
  }

  // If not focused (on other pages), show CTA with glow effects
  return (
    <View style={styles.ctaWrapper}>
      {/* Animated Glow effect layers */}
      <Animated.View
        style={[
          styles.glowOuter,
          {
            backgroundColor: ctaColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowMiddle,
          {
            backgroundColor: ctaColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowInner,
          {
            backgroundColor: ctaColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Main CTA button */}
      <View style={[styles.ctaContainer, { backgroundColor: ctaColor }]}>
        <Mic size={STYLES.cta.iconSize} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // Get current active tab
  const getCurrentTab = () => {
    const currentTab = segments[1]; // Get the tab name from segments
    return currentTab || "interpret"; // Default to interpret
  };

  // Glow animation for CTA button
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const currentTab = getCurrentTab();
    if (currentTab !== "interpret") {
      // Show glow animation when NOT on interpret page
      const pulseAnimation = Animated.loop(
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
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [getCurrentTab(), pulseAnim]);

  // Modern animation refs for micro-interactions
  const tabScaleAnim = useRef(new Animated.Value(1)).current;

  // STEP 3: Navigation handlers with haptic feedback and modern animations
  const handleTabPress = (tabName: string) => {
    // Modern spring micro-interaction
    Animated.sequence([
      Animated.spring(tabScaleAnim, {
        toValue: 0.95,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(tabScaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Enhanced haptic feedback
    if (Platform.OS === "ios") {
      if (tabName === "interpret") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Stronger CTA feedback
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Refined tab feedback
      }
    } else {
      Vibration.vibrate(tabName === "interpret" ? 80 : 30);
    }

    // Navigate to tab
    router.push(
      tabName as "/(tabs)/library" | "/(tabs)/interpret" | "/(tabs)/profile"
    );
  };

  // STEP 1: Disable Expo Tabs and create skeleton
  return (
    <View style={{ flex: 1 }}>
      {/* Screen content area */}
      <View style={{ flex: 1 }}>
        <Tabs
          initialRouteName="interpret"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" }, // Hide default tabbar
          }}
        >
          <Tabs.Screen name="library" />
          <Tabs.Screen name="interpret" />
          <Tabs.Screen name="profile" />
        </Tabs>
      </View>

      <View
        style={[
          styles.customTabbarContainer,
          { bottom: Math.max(insets.bottom, 20) + 20 },
        ]}
      >
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress("library")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              getCurrentTab() === "library" && styles.iconContainerFocused,
            ]}
          >
            <BookOpen
              size={STYLES.icon.size}
              color={
                getCurrentTab() === "library"
                  ? Colors.underTheMoonlight.midnight
                  : Colors.underTheMoonlight.dusk
              }
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            styles.tabButtonCTA,
            getCurrentTab() === "interpret" && styles.tabButtonCTAActive,
          ]}
          onPress={() => handleTabPress("interpret")}
          activeOpacity={0.8}
        >
          <View style={styles.ctaWrapper}>
            {getCurrentTab() !== "interpret" && (
              <>
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
              </>
            )}

            <View
              style={[
                styles.ctaIconContainer,
                getCurrentTab() === "interpret" &&
                  styles.ctaIconContainerActive,
              ]}
            >
              <Mic
                size={STYLES.cta.iconSize}
                color={
                  getCurrentTab() === "interpret"
                    ? Colors.underTheMoonlight.dusk
                    : "#FFFFFF"
                }
                strokeWidth={2.5}
              />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress("profile")}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              getCurrentTab() === "profile" && styles.iconContainerFocused,
            ]}
          >
            <User
              size={STYLES.icon.size}
              color={
                getCurrentTab() === "profile"
                  ? Colors.underTheMoonlight.midnight
                  : Colors.underTheMoonlight.dusk
              }
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly", // space-around yerine space-evenly
    alignItems: "center",
    position: "absolute",
    bottom: STYLES.tabBar.bottom,
    left: 0,
    right: 0,
    marginHorizontal: STYLES.tabBar.marginHorizontal,
    backgroundColor: Colors.underTheMoonlight.moonlight,
    borderRadius: STYLES.tabBar.borderRadius,
    height: STYLES.tabBar.height,
    paddingHorizontal: STYLES.tabBar.paddingHorizontal,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: STYLES.icon.containerSize,
    height: STYLES.icon.containerSize,
    borderRadius: STYLES.icon.containerSize / 2,
  },
  iconContainerFocused: {
    backgroundColor: "rgba(255,255,255,0.9)",
    width: STYLES.cta.size,
    height: STYLES.cta.size,
    borderRadius: STYLES.cta.size / 2,
  },
  ctaWrapper: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: STYLES.tabBar.height, // Minimum yükseklik garantisi
  },
  ctaContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: STYLES.cta.size,
    height: STYLES.cta.size,
    borderRadius: STYLES.cta.borderRadius,
    borderWidth: STYLES.cta.borderWidth,
    borderColor: Colors.underTheMoonlight.moonlight,
    zIndex: 10,
  },
  glowOuter: {
    position: "absolute",
    width: STYLES.glow.outer,
    height: STYLES.glow.outer,
    borderRadius: STYLES.glow.outer / 2,
    opacity: 0.15,
    zIndex: 1,
  },
  glowMiddle: {
    position: "absolute",
    width: STYLES.glow.middle,
    height: STYLES.glow.middle,
    borderRadius: STYLES.glow.middle / 2,
    opacity: 0.25,
    zIndex: 2,
  },
  glowInner: {
    position: "absolute",
    width: STYLES.glow.inner,
    height: STYLES.glow.inner,
    borderRadius: STYLES.glow.inner / 2,
    opacity: 0.35,
    zIndex: 3,
  },

  customTabbarContainer: {
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    position: "absolute",
    bottom: STYLES.tabBar.bottom,
    left: 0,
    right: 0,
    marginHorizontal: STYLES.tabBar.marginHorizontal,
    backgroundColor: Colors.underTheMoonlight.moonlight,
    borderRadius: STYLES.tabBar.borderRadius,
    height: STYLES.tabBar.height,
    paddingHorizontal: STYLES.tabBar.paddingHorizontal,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: STYLES.icon.containerSize / 2,
  },
  tabButtonActive: {
    backgroundColor: "rgba(255,255,255,1)",
  },
  tabButtonCTA: {
    // CTA buton için özel stil - boyut değişikliği yok
  },
  tabButtonCTAActive: {
    // CTA buton aktif durumu - boyut değişikliği yok
  },
  ctaIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: STYLES.cta.size,
    height: STYLES.cta.size,
    borderRadius: STYLES.cta.borderRadius,
    backgroundColor: Colors.underTheMoonlight.midnight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  ctaIconContainerActive: {
    backgroundColor: "rgba(255,255,255,1)",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});
