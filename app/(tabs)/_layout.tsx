import React, { useEffect, useRef } from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Animated } from "react-native";
import { BookOpen, Mic, User } from "lucide-react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Custom tab bar icons using Lucide
function TabBarIcon({
  icon: Icon,
  color,
  focused,
  size = 24,
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

  // Animation for pulsing glow effect
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, [pulseAnim]);

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
        <Mic size={32} color="#FFFFFF" strokeWidth={2.5} />
      </View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false, // Remove all headers
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: Platform.OS === "ios",
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="interpret"
        options={{
          title: "Interpret Dream",
          tabBarIcon: ({ color, focused }) => (
            <CTATabIcon color={color} focused={focused} />
          ),
        }}
      />
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
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    marginHorizontal: 30,
    backgroundColor: Colors.underTheMoonlight.moonlight,
    borderRadius: 25,
    height: 70,
    paddingTop: 15,
    paddingHorizontal: 10,
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
    width: 78,
    height: 78,
    borderRadius: 43,
    borderWidth: 4,
    borderColor: Colors.underTheMoonlight.moonlight, // Same as page background
    zIndex: 10,
  },
  // Glow effect layers for magical appearance - adjusted for 92px button
  glowOuter: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 65,
    opacity: 0.15,
    zIndex: 1,
  },
  glowMiddle: {
    position: "absolute",
    width: 105,
    height: 105,
    borderRadius: 57.5,
    opacity: 0.25,
    zIndex: 2,
  },
  glowInner: {
    position: "absolute",
    width: 95,
    height: 95,
    borderRadius: 52.5,
    opacity: 0.35,
    zIndex: 3,
  },
});
