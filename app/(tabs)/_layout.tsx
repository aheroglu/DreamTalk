import React, { useEffect, useRef } from "react";
import { Tabs, useRouter, useSegments } from "expo-router";
import {
  View,
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
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

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
    size: 78,
    borderRadius: 39,
    borderWidth: 4,
    iconSize: 32,
  },
  glow: {
    outer: 120,
    middle: 105,
    inner: 95,
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
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  // Tab navigation array for swipe gestures
  const tabs = ["library", "interpret", "profile"];

  // Get current tab index
  const getCurrentTabIndex = () => {
    const currentTab = segments[1]; // Get the tab name from segments
    const index = tabs.indexOf(currentTab || "interpret");
    return index !== -1 ? index : 1; // Default to interpret (index 1)
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="interpret"
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabIconDefault,
          headerShown: false, // Remove all headers
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: Platform.OS === "ios",
          tabBarItemStyle: {
            // Web'deki gibi basit - flex: 1 yeterli
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          },
          lazy: true,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="library"
          options={{
            title: "Dream Library",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={BookOpen} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="interpret"
          options={{
            title: "Interpret Dream",
            tabBarIcon: ({ color, focused }) => (
              <CTATabIcon color={color} focused={focused} />
            ),
            tabBarButton: EnhancedHapticTab,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={User} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    // Pure CSS flexbox approach
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
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
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: STYLES.icon.containerSize,
    height: STYLES.icon.containerSize,
    borderRadius: STYLES.icon.containerSize / 2,
  },
  iconContainerFocused: {
    backgroundColor: Colors.underTheMoonlight.dusk,
  },
  ctaWrapper: {
    alignItems: "center",
    justifyContent: "center",
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
});
