import { Redirect } from 'expo-router';

// Root index — always redirect to the welcome screen on first load.
// Once auth is complete, navigation pushes to /(tabs).
export default function Index() {
  return <Redirect href="/welcome" />;
}
