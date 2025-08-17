import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

export default function Index() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.underTheMoonlight.moonlight }}>
        <ActivityIndicator size="large" color={Colors.underTheMoonlight.midnight} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/interpret" />;
  }

  // İlk kez kullanıcı - onboarding göster
  return <Redirect href="/onboarding" />;
}