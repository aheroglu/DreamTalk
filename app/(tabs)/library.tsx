import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,

  Animated,
  Platform,
  Vibration,
  Dimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "@/components/Themed";
import { Search, Star, Moon, Heart } from "lucide-react-native";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

// Web-style constants - fixed values only
const BOTTOM_SPACER_HEIGHT = 120;

// Dummy dream symbols data
const dreamSymbols = [
  {
    id: "1",
    symbol: "🌙",
    title: "Moon",
    category: "Nature",
    meaning:
      "Represents intuition, femininity, and the subconscious mind. A full moon suggests completion, while a new moon indicates new beginnings.",
    popularity: 5,
  },
  {
    id: "2",
    symbol: "🌊",
    title: "Water",
    category: "Nature",
    meaning:
      "Symbolizes emotions, purification, and the flow of life. Clear water represents peace, while turbulent water suggests emotional turmoil.",
    popularity: 5,
  },
  {
    id: "3",
    symbol: "🦋",
    title: "Butterfly",
    category: "Animals",
    meaning:
      "Represents transformation, rebirth, and personal growth. Often indicates a period of positive change in your life.",
    popularity: 4,
  },
  {
    id: "4",
    symbol: "🏠",
    title: "House",
    category: "Objects",
    meaning:
      "Symbolizes the self, family, and security. Different rooms may represent different aspects of your personality.",
    popularity: 4,
  },
  {
    id: "5",
    symbol: "🕊️",
    title: "Bird",
    category: "Animals",
    meaning:
      "Represents freedom, spirituality, and higher perspective. Flying birds suggest liberation from constraints.",
    popularity: 4,
  },
  {
    id: "6",
    symbol: "🌸",
    title: "Flowers",
    category: "Nature",
    meaning:
      "Symbolize beauty, growth, and fleeting moments. Different flowers have specific meanings related to love and emotions.",
    popularity: 3,
  },
];

const categories = ["All", "Nature", "Animals", "Objects"];

export default function LibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

    // Only swipe left -> go to interpret (next tab)
    if (translationX < -swipeThreshold || velocityX < -velocityThreshold) {
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

  const filteredSymbols = dreamSymbols.filter((symbol) => {
    const matchesSearch =
      symbol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || symbol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDreamCard = ({ item }: { item: (typeof dreamSymbols)[0] }) => (
    <TouchableOpacity style={styles.dreamCard}>
      <View style={[styles.cardHeader, { backgroundColor: "transparent" }]}>
        <Text style={styles.symbolEmoji}>{item.symbol}</Text>
        <View
          style={[
            styles.cardTitleContainer,
            { backgroundColor: "transparent" },
          ]}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <View
          style={[
            styles.popularityContainer,
            { backgroundColor: "transparent" },
          ]}
        >
          <View
            style={[styles.starsWrapper, { backgroundColor: "transparent" }]}
          >
            {[...Array(item.popularity)].map((_, i) => (
              <Star
                key={i}
                size={12}
                color={Colors.underTheMoonlight.dusk}
                fill={Colors.underTheMoonlight.dusk}
              />
            ))}
          </View>
        </View>
      </View>
      <Text style={styles.cardMeaning}>{item.meaning}</Text>
    </TouchableOpacity>
  );

  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.categoryTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient
        colors={[
          Colors.underTheMoonlight.moonlight, // Top: same as current
          "#F8F8FF", // Bottom: very light lavender/white
        ]}
        style={styles.container}
      >
        <View style={[styles.transparentContainer, { paddingTop: insets.top }]}>
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
                  <View style={styles.headerContent}>
                    <Moon size={28} color={Colors.underTheMoonlight.dusk} />
                    <Text style={styles.title}>Dream Library</Text>
                    <Text style={styles.subtitle}>
                      Discover the meanings behind common dream symbols
                    </Text>
                  </View>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#999" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search dream symbols..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Category Filter */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.categoriesContainer}
                >
                  {categories.map(renderCategoryChip)}
                </ScrollView>

                {/* Dream Cards */}
                <View style={[styles.cardsContainer, { paddingBottom: 120 + insets.bottom }]}>
                  <FlatList
                    data={filteredSymbols}
                    renderItem={renderDreamCard}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ItemSeparatorComponent={() => (
                      <View style={styles.cardSeparator} />
                    )}
                  />
                </View>
              </ScrollView>
            </Animated.View>
          </PanGestureHandler>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  transparentContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  animatedContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 10, // Reduced from 20 to 10
    paddingBottom: 24,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: Colors.underTheMoonlight.dusk,
    borderColor: Colors.underTheMoonlight.dusk,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  categoryTextActive: {
    color: "#FFF",
  },
  cardsContainer: {
    paddingBottom: 120, // Space for floating tabbar
    backgroundColor: "transparent",
  },
  dreamCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.04)",
  },
  cardSeparator: {
    height: 16,
    backgroundColor: "transparent",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  symbolEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 14,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  popularityContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  starsWrapper: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  cardMeaning: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
});
