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
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/components/Themed";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

// Modern CSS Grid approach - Fixed, simple values
const LAYOUT = {
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  spacing: {
    section: 24,
    element: 16,
    card: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
  },
  avatar: {
    size: 72,
  },
};

// Profile data structure
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
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(profileData.settings);
  const [isAuthenticated, setIsAuthenticated] = useState(
    profileData.isAuthenticated
  );

  // Simple animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
      };
    }, [fadeAnim])
  );

  // Tab swipe navigation - only right swipe (to interpret)
  const handleTabSwipe = (event: any) => {
    const { translationX, state } = event.nativeEvent;

    if (state !== State.END) return;

    const swipeThreshold = 100;

    if (translationX > swipeThreshold) {
      if (Platform.OS === "ios") {
        Haptics.selectionAsync();
      }
      router.push("/(tabs)/interpret");
    }
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

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => setIsAuthenticated(false),
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[Colors.underTheMoonlight.moonlight, "#F8F8FF"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <PanGestureHandler
            onHandlerStateChange={handleTabSwipe}
            minDist={50}
            shouldCancelWhenOutside={true}
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              {/* Scrollable Content with Header Inside */}
              <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              >
                {/* Header Section */}
                <View style={styles.headerSection}>
                  <View style={styles.headerContent}>
                    <User size={28} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.subtitle}>
                      Manage your dream journey and preferences
                    </Text>
                  </View>
                </View>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Moon
                        size={32}
                        color={Colors.underTheMoonlight.moonlight}
                      />
                    </View>
                  </View>

                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>
                      {isAuthenticated
                        ? profileData.user.name
                        : "Anonymous Dreamer"}
                    </Text>
                    <Text style={styles.profileStatus}>
                      {isAuthenticated
                        ? profileData.user.email
                        : "Sign in to sync your dreams"}
                    </Text>
                  </View>
                </View>

                {/* Dream Stats */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Sparkles size={20} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.sectionTitle}>Dream Journey</Text>
                  </View>

                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <BarChart3
                        size={24}
                        color={Colors.underTheMoonlight.midnight}
                      />
                      <Text style={styles.statNumber}>
                        {profileData.dreamStats.totalDreams}
                      </Text>
                      <Text style={styles.statLabel}>Total Dreams</Text>
                    </View>

                    <View style={styles.statCard}>
                      <Calendar
                        size={24}
                        color={Colors.underTheMoonlight.midnight}
                      />
                      <Text style={styles.statNumber}>
                        {profileData.dreamStats.thisMonth}
                      </Text>
                      <Text style={styles.statLabel}>This Month</Text>
                    </View>
                  </View>
                </View>

                {/* Settings */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Settings size={20} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.sectionTitle}>Settings</Text>
                  </View>

                  <View style={styles.settingsContainer}>
                    {/* Notifications */}
                    <View style={styles.settingCard}>
                      <View style={styles.settingLeft}>
                        <Bell size={20} color={Colors.underTheMoonlight.dusk} />
                        <View style={styles.settingText}>
                          <Text style={styles.settingTitle}>
                            Dream Reminders
                          </Text>
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
                      <View style={styles.settingLeft}>
                        <Shield
                          size={20}
                          color={Colors.underTheMoonlight.dusk}
                        />
                        <View style={styles.settingText}>
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

                {/* Data Management */}
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Shield size={20} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.sectionTitle}>Your Data</Text>
                  </View>

                  <View style={styles.dataContainer}>
                    <TouchableOpacity
                      style={styles.dataAction}
                      onPress={handleDeleteData}
                    >
                      <View style={styles.settingLeft}>
                        <Trash2 size={20} color="#E53E3E" />
                        <View style={styles.settingText}>
                          <Text
                            style={[styles.settingTitle, { color: "#E53E3E" }]}
                          >
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

                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                >
                  <LogOut size={20} color="#E53E3E" />
                  <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>

                {/* Bottom Spacer */}
                <View style={[styles.bottomSpacer, { height: 100 + insets.bottom }]} />
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </SafeAreaView>
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

  // Scrollable Content - CSS Grid: Flex 1
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: LAYOUT.container.paddingHorizontal,
    gap: LAYOUT.spacing.section,
  },

  // Header Section - Inside ScrollView
  headerSection: {
    paddingTop: LAYOUT.container.paddingTop,
    paddingBottom: LAYOUT.spacing.element,
    backgroundColor: "transparent",
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.underTheMoonlight.midnight,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },

  // Profile Card
  profileCard: {
    backgroundColor: "transparent",
    borderRadius: LAYOUT.card.borderRadius,
    padding: LAYOUT.card.padding,
    alignItems: "center",
    gap: LAYOUT.spacing.element,
  },
  avatarContainer: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  avatar: {
    width: LAYOUT.avatar.size,
    height: LAYOUT.avatar.size,
    borderRadius: LAYOUT.avatar.size / 2,
    backgroundColor: Colors.underTheMoonlight.dusk,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    gap: 4,
    backgroundColor: "transparent",
  },
  profileName: {
    backgroundColor: "transparent",
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
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
    borderRadius: 16,
  },
  signInText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Sections
  section: {
    gap: LAYOUT.spacing.element,
    backgroundColor: "transparent",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    gap: LAYOUT.spacing.card,
    backgroundColor: "transparent",
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: LAYOUT.card.borderRadius,
    padding: LAYOUT.card.padding,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },

  // Settings
  settingsContainer: {
    gap: LAYOUT.spacing.card,
    backgroundColor: "transparent",
  },
  settingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderRadius: LAYOUT.card.borderRadius,
    padding: LAYOUT.card.padding,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
    backgroundColor: "transparent",
  },
  settingText: {
    flex: 1,
    gap: 2,
    backgroundColor: "transparent",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  // Data Management
  dataContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: LAYOUT.card.borderRadius,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  dataAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: LAYOUT.card.padding,
  },

  // Sign Out
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderRadius: LAYOUT.card.borderRadius,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  signOutText: {
    color: "#E53E3E",
    fontSize: 16,
    fontWeight: "500",
  },

  // Bottom Spacer - CSS Grid: Fixed height for tabbar
  bottomSpacer: {
    backgroundColor: "transparent",
    height: 100,
  },
});
