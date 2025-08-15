import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
  Animated,
  Platform,
  Vibration,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

// Web-style constants - fixed values only
const BOTTOM_SPACER_HEIGHT = 120;

import {
  User,
  Settings,
  Moon,
  Bell,
  Shield,
  Trash2,
  LogOut,
  ChevronRight,
  Sparkles,
  Calendar,
  BarChart3,
} from "lucide-react-native";
import Colors from "@/constants/Colors";

// MVP Profile Data (will be replaced with Supabase data)
const profileData = {
  isAuthenticated: false,
  user: {
    name: "Dream Explorer",
    email: null,
    joinedDate: new Date().toISOString(),
  },
  dreamStats: {
    totalDreams: 0,
    thisMonth: 0,
    favoriteSymbol: null,
  },
  settings: {
    notifications: true,
    privacyMode: false,
    dataCollection: true,
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState(profileData.settings);
  const [isAuthenticated, setIsAuthenticated] = useState(
    profileData.isAuthenticated
  );

  // Page transition animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Handle tab swipe navigation
  const handleTabSwipe = (event: any) => {
    const { translationX, velocityX, state } = event.nativeEvent;

    // Only handle gesture end
    if (state !== State.END) return;

    const swipeThreshold = 100;
    const velocityThreshold = 800;

    // Only swipe right -> go to interpret (previous tab)
    if (translationX > swipeThreshold || velocityX > velocityThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      } else {
        Vibration.vibrate(20);
      }
      router.push("/(tabs)/interpret");
    }
  };

  // Page focus animation
  useFocusEffect(
    React.useCallback(() => {
      // Animate in when page comes into focus
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Reset animations when page loses focus
      return () => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.95);
      };
    }, [fadeAnim, scaleAnim])
  );

  const handleSignIn = () => {
    Alert.alert(
      "Sign In",
      "Connect your account to sync dreams across devices and unlock premium features.",
      [
        { text: "Later", style: "cancel" },
        { text: "Sign In", onPress: () => console.log("Sign in pressed") },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete All Data",
      "This action cannot be undone. All your dreams and settings will be permanently removed.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => console.log("Delete pressed"),
        },
      ]
    );
  };

  const renderProfileCard = () => (
    <View style={[styles.profileCard, { backgroundColor: "transparent" }]}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatarBackground}>
          <Moon size={32} color={Colors.underTheMoonlight.moonlight} />
        </View>
      </View>
      <View style={[styles.profileInfo, { backgroundColor: "transparent" }]}>
        <Text style={styles.profileName}>
          {isAuthenticated ? profileData.user.name : "Anonymous Dreamer"}
        </Text>
        <Text style={styles.profileStatus}>
          {isAuthenticated
            ? profileData.user.email
            : "Sign in to sync your dreams"}
        </Text>
      </View>
      {!isAuthenticated && (
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderDreamStats = () => (
    <View style={[styles.sectionContainer, { backgroundColor: "transparent" }]}>
      <View style={[styles.sectionHeader, { backgroundColor: "transparent" }]}>
        <Sparkles size={20} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.sectionTitle}>Dream Journey</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <BarChart3 size={24} color={Colors.underTheMoonlight.midnight} />
          <Text style={styles.statNumber}>
            {profileData.dreamStats.totalDreams}
          </Text>
          <Text style={styles.statLabel}>Total Dreams</Text>
        </View>

        <View style={styles.statCard}>
          <Calendar size={24} color={Colors.underTheMoonlight.midnight} />
          <Text style={styles.statNumber}>
            {profileData.dreamStats.thisMonth}
          </Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
      </View>
    </View>
  );

  const renderSettingsSection = () => (
    <View style={[styles.sectionContainer, { backgroundColor: "transparent" }]}>
      <View style={[styles.sectionHeader, { backgroundColor: "transparent" }]}>
        <Settings size={20} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.sectionTitle}>Settings</Text>
      </View>

      <View style={styles.settingsContainer}>
        {/* Notifications */}
        <View style={styles.settingCard}>
          <View
            style={[styles.settingLeft, { backgroundColor: "transparent" }]}
          >
            <Bell size={20} color={Colors.underTheMoonlight.dusk} />
            <View
              style={[styles.settingText, { backgroundColor: "transparent" }]}
            >
              <Text style={styles.settingTitle}>Dream Reminders</Text>
              <Text style={styles.settingSubtitle}>
                Get gentle reminders to record your dreams
              </Text>
            </View>
          </View>
          <Switch
            value={settings.notifications}
            onValueChange={(value) =>
              setSettings({ ...settings, notifications: value })
            }
            trackColor={{
              false: "#E0E0E0",
              true: Colors.underTheMoonlight.dusk,
            }}
            thumbColor={
              settings.notifications
                ? Colors.underTheMoonlight.moonlight
                : "#F0F0F0"
            }
          />
        </View>

        {/* Privacy Mode */}
        <View style={styles.settingCard}>
          <View
            style={[styles.settingLeft, { backgroundColor: "transparent" }]}
          >
            <Shield size={20} color={Colors.underTheMoonlight.dusk} />
            <View
              style={[styles.settingText, { backgroundColor: "transparent" }]}
            >
              <Text style={styles.settingTitle}>Privacy Mode</Text>
              <Text style={styles.settingSubtitle}>
                Keep dreams local, no cloud sync
              </Text>
            </View>
          </View>
          <Switch
            value={settings.privacyMode}
            onValueChange={(value) =>
              setSettings({ ...settings, privacyMode: value })
            }
            trackColor={{
              false: "#E0E0E0",
              true: Colors.underTheMoonlight.dusk,
            }}
            thumbColor={
              settings.privacyMode
                ? Colors.underTheMoonlight.moonlight
                : "#F0F0F0"
            }
          />
        </View>
      </View>
    </View>
  );

  const renderDataSection = () => (
    <View style={[styles.sectionContainer, { backgroundColor: "transparent" }]}>
      <View style={[styles.sectionHeader, { backgroundColor: "transparent" }]}>
        <Shield size={20} color={Colors.underTheMoonlight.dusk} />
        <Text style={styles.sectionTitle}>Your Data</Text>
      </View>

      <View style={styles.settingsList}>
        {/* Delete Data - Last item, remove border */}
        <TouchableOpacity
          style={[styles.settingItem, { borderBottomWidth: 0 }]}
          onPress={handleDeleteData}
        >
          <View
            style={[styles.settingLeft, { backgroundColor: "transparent" }]}
          >
            <Trash2 size={20} color="#E53E3E" />
            <View
              style={[styles.settingText, { backgroundColor: "transparent" }]}
            >
              <Text style={[styles.settingTitle, { color: "#E53E3E" }]}>
                Delete All Data
              </Text>
              <Text style={styles.settingSubtitle}>
                Permanently remove all dreams
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <PanGestureHandler
          onHandlerStateChange={handleTabSwipe}
          minDist={50}
          shouldCancelWhenOutside={true}
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
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <View
                  style={[
                    styles.headerTitle,
                    { backgroundColor: "transparent" },
                  ]}
                >
                  <User size={28} color={Colors.underTheMoonlight.dusk} />
                  <Text style={styles.title}>Profile</Text>
                </View>
                <Text style={styles.subtitle}>
                  Manage your dream journey and preferences
                </Text>
              </View>

              {/* Profile Card */}
              {renderProfileCard()}

              {/* Dream Statistics */}
              {renderDreamStats()}

              {/* Settings */}
              {renderSettingsSection()}

              {/* Data Management */}
              {renderDataSection()}

              {/* Sign Out (if authenticated) */}
              {isAuthenticated && (
                <TouchableOpacity style={styles.signOutButton}>
                  <LogOut size={20} color="#E53E3E" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
              )}

              <View style={styles.bottomSpacer} />
            </ScrollView>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.underTheMoonlight.moonlight,
  },
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginLeft: 40,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.04)",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.underTheMoonlight.dusk,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: Colors.underTheMoonlight.midnight,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: "center",
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  settingsContainer: {
    gap: 12,
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.04)",
  },
  settingsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.04)",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  signOutText: {
    color: "#E53E3E",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: BOTTOM_SPACER_HEIGHT, // Web'deki gibi sabit
  },
});
