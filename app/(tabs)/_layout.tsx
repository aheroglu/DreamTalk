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
import * as Device from 'expo-device';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive design helpers
const getResponsiveValue = (base: number, factor: number = 1) => {
  // Base for iPhone 11 (414x896)
  const baseWidth = 414;
  const scale = screenWidth / baseWidth;
  return Math.round(base * scale * factor);
};

// Web'deki gibi basit responsive sistem - sadece temel değerler
const responsiveStyles = {
  // Tüm cihazlar için sabit değerler (web'deki rem gibi)
  tabBarHeight: 70,
  tabBarBottom: 40,
  tabBarMarginHorizontal: 30,
  tabBarBorderRadius: 25,
  iconContainerSize: 50,
  iconSize: 24,
  ctaContainerSize: 78,
  ctaBorderRadius: 39,
  ctaBorderWidth: 4,
  glowOuterSize: 120,
  glowMiddleSize: 105,
  glowInnerSize: 95,
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
  size = responsiveStyles.iconSize,
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
        <Mic size={getResponsiveValue(32)} color="#FFFFFF" strokeWidth={2.5} />
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
    // Web'deki gibi basit flexbox - bu kadar!
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around", // Eşit dağıtım
    alignItems: "center",
    position: "absolute",
    bottom: responsiveStyles.tabBarBottom,
    left: 0,
    right: 0,
    marginHorizontal: responsiveStyles.tabBarMarginHorizontal,
    backgroundColor: Colors.underTheMoonlight.moonlight,
    borderRadius: responsiveStyles.tabBarBorderRadius,
    height: responsiveStyles.tabBarHeight,
    paddingHorizontal: 20, // Web'deki gibi sabit padding
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: responsiveStyles.iconContainerSize,
    height: responsiveStyles.iconContainerSize,
    borderRadius: responsiveStyles.iconContainerSize / 2,
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
    width: responsiveStyles.ctaContainerSize,
    height: responsiveStyles.ctaContainerSize,
    borderRadius: responsiveStyles.ctaBorderRadius,
    borderWidth: responsiveStyles.ctaBorderWidth,
    borderColor: Colors.underTheMoonlight.moonlight, // Same as page background
    zIndex: 10,
  },
  // Glow effect layers for magical appearance - responsive sizing
  glowOuter: {
    position: "absolute",
    width: responsiveStyles.glowOuterSize,
    height: responsiveStyles.glowOuterSize,
    borderRadius: responsiveStyles.glowOuterSize / 2,
    opacity: 0.15,
    zIndex: 1,
  },
  glowMiddle: {
    position: "absolute",
    width: responsiveStyles.glowMiddleSize,
    height: responsiveStyles.glowMiddleSize,
    borderRadius: responsiveStyles.glowMiddleSize / 2,
    opacity: 0.25,
    zIndex: 2,
  },
  glowInner: {
    position: "absolute",
    width: responsiveStyles.glowInnerSize,
    height: responsiveStyles.glowInnerSize,
    borderRadius: responsiveStyles.glowInnerSize / 2,
    opacity: 0.35,
    zIndex: 3,
  },
});
