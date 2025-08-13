import React, { useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView 
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Search, Star, Moon, Heart } from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Dummy dream symbols data
const dreamSymbols = [
  {
    id: '1',
    symbol: '🌙',
    title: 'Moon',
    category: 'Nature',
    meaning: 'Represents intuition, femininity, and the subconscious mind. A full moon suggests completion, while a new moon indicates new beginnings.',
    popularity: 5
  },
  {
    id: '2', 
    symbol: '🌊',
    title: 'Water',
    category: 'Nature',
    meaning: 'Symbolizes emotions, purification, and the flow of life. Clear water represents peace, while turbulent water suggests emotional turmoil.',
    popularity: 5
  },
  {
    id: '3',
    symbol: '🦋',
    title: 'Butterfly',
    category: 'Animals',
    meaning: 'Represents transformation, rebirth, and personal growth. Often indicates a period of positive change in your life.',
    popularity: 4
  },
  {
    id: '4',
    symbol: '🏠',
    title: 'House',
    category: 'Objects',
    meaning: 'Symbolizes the self, family, and security. Different rooms may represent different aspects of your personality.',
    popularity: 4
  },
  {
    id: '5',
    symbol: '🕊️',
    title: 'Bird',
    category: 'Animals',
    meaning: 'Represents freedom, spirituality, and higher perspective. Flying birds suggest liberation from constraints.',
    popularity: 4
  },
  {
    id: '6',
    symbol: '🌸',
    title: 'Flowers',
    category: 'Nature',
    meaning: 'Symbolize beauty, growth, and fleeting moments. Different flowers have specific meanings related to love and emotions.',
    popularity: 3
  },
];

const categories = ['All', 'Nature', 'Animals', 'Objects'];

export default function LibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredSymbols = dreamSymbols.filter(symbol => {
    const matchesSearch = symbol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         symbol.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || symbol.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDreamCard = ({ item }: { item: typeof dreamSymbols[0] }) => (
    <TouchableOpacity style={styles.dreamCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.symbolEmoji}>{item.symbol}</Text>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <View style={styles.popularityContainer}>
          {[...Array(item.popularity)].map((_, i) => (
            <Star key={i} size={14} color={Colors.softSpring.blush} fill={Colors.softSpring.blush} />
          ))}
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
        selectedCategory === category && styles.categoryChipActive
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.categoryTextActive
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Moon size={28} color={Colors.softSpring.lavender} />
            <Text style={styles.title}>Dream Library</Text>
          </View>
          <Text style={styles.subtitle}>
            Discover the meanings behind common dream symbols
          </Text>
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
        <View style={styles.cardsContainer}>
          <FlatList
            data={filteredSymbols}
            renderItem={renderDreamCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.cardSeparator} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.softSpring.cream,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginLeft: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
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
    color: '#333',
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  categoryChipActive: {
    backgroundColor: Colors.softSpring.lavender,
    borderColor: Colors.softSpring.lavender,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    color: '#333',
  },
  cardsContainer: {
    paddingBottom: 120, // Space for floating tabbar
  },
  dreamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSeparator: {
    height: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 14,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  popularityContainer: {
    flexDirection: 'row',
  },
  cardMeaning: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
  },
});