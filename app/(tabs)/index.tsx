import { Redirect } from 'expo-router';

export default function TabIndexScreen() {
  // Redirect to interpret screen as the default
  return <Redirect href="/interpret" />;
}