import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dream Library</Text>
      <Text style={styles.description}>
        Explore common dream symbols and their meanings
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});