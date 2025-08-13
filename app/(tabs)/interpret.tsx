import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function InterpretScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dream Interpretation</Text>
      <Text style={styles.description}>
        Record your dream and get an AI-powered interpretation
      </Text>
      <View style={styles.recordButton}>
        <Text style={styles.recordText}>🎤 Tap to Record</Text>
      </View>
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
    marginBottom: 32,
  },
  recordButton: {
    backgroundColor: '#FFE3F1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recordText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});