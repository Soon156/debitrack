import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '../../components/ThemedText';

export default function DashboardPage() {

  return (
    <ThemedView style={styles.container}>
      <ThemedText>
        Dashboard
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
