import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { BookOpen, Mic, User } from "lucide-react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Custom tab bar icons using Lucide
function TabBarIcon({ 
  icon: Icon, 
  color, 
  focused, 
  size = 24 
}: { 
  icon: any; 
  color: string; 
  focused: boolean;
  size?: number;
}) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
      <Icon size={size} color={color} />
    </View>
  );
}

// Special CTA tab for the center interpret button
function CTATabIcon({ 
  color, 
  focused 
}: { 
  color: string; 
  focused: boolean;
}) {
  const colorScheme = useColorScheme();
  const ctaColor = focused ? Colors[colorScheme ?? "light"].primary : color;
  
  return (
    <View style={[styles.ctaContainer, { backgroundColor: ctaColor }]}>
      <Mic size={28} color="#FFFFFF" />
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
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: Platform.OS === 'ios',
      }}
    >
      <Tabs.Screen
        name="library"
        options={{
          title: "Dream Library",
          headerTitle: "Dream Library",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={BookOpen} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="interpret"
        options={{
          title: "Interpret Dream",
          headerTitle: "Interpret Your Dream",
          tabBarIcon: ({ color, focused }) => (
            <CTATabIcon color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={User} color={color} focused={focused} />
          ),
        }}
      />
      {/* Hide old tab screens */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // This hides the tab
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // This hides the tab
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: Colors.softSpring.cream,
    borderRadius: 25,
    height: 70,
    paddingBottom: 0,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainerFocused: {
    backgroundColor: Colors.softSpring.lavender,
  },
  ctaContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
