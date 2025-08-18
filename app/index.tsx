import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useOnboarding } from '@/hooks/useOnboarding';
import { View, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

export default function Index() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hasSeenOnboarding, loading: onboardingLoading } = useOnboarding();

  // Show loading while checking both auth and onboarding status
  if (authLoading || onboardingLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.underTheMoonlight.moonlight }}>
        <ActivityIndicator size="large" color={Colors.underTheMoonlight.midnight} />
      </View>
    );
  }

  // User is authenticated - go to main app
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/interpret" />;
  }

  // User not authenticated - check onboarding status
  if (hasSeenOnboarding) {
    // Returning user - direct to sign in
    return <Redirect href="/auth/signin" />;
  } else {
    // First time user - show onboarding
    return <Redirect href="/onboarding" />;
  }
}