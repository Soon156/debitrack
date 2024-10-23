import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import RecordModal from '@/constants/Modal';
import { ListItem } from '@rneui/themed';
import { ThemedText } from './ThemedText';
import HeaderView from './HeaderView';

const HEADER_HEIGHT = 200;

interface ScrollViewProps {
  recordList: RecordModal[];
  amount: number;
}

export default function ScrollView({ recordList, amount }: ScrollViewProps) {
  var offsetY = useSharedValue(0);
  const previousOffsetY = useSharedValue(0);
  const [selectedId, setSelectedId] = useState<string>();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  const setOffsetY = () => {
    previousOffsetY.value = offsetY.value;
  }

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            offsetY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / HEADER_HEIGHT, 0, HEADER_HEIGHT * 0.75],
            'clamp'
          ),
        },
      ],
      opacity: interpolate(
        offsetY.value,
        [0, HEADER_HEIGHT], // Scroll top to bottom
        [1, 0], // Fully visible at the top, fully hidden at the bottom
        'clamp'
      ),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    const isScrollingDown = offsetY.value > previousOffsetY.value;

    let opacity = interpolate(
      offsetY.value,
      [0, HEADER_HEIGHT / 2],
      [1, 0], // Button will fade out
      'clamp'
    );

    let translateY = interpolate(
      offsetY.value,
      [0, HEADER_HEIGHT / 2],
      [0, 100], // Button will move down
      'clamp'
    );

    if (!isScrollingDown) {
      opacity = 1;
      translateY = 0;
    }

    return {
      opacity: withTiming(opacity, { duration: 200 }), // Smooth fading
      transform: [{ translateY: withTiming(translateY, { duration: 200 }) }], // Smooth movement
    };
  });

  const renderItem = ({ item }: { item: RecordModal }) => {
    return (
      <ListItem key={item.id} onPress={() => {
        setSelectedId(item.id ? item.id.toString() : '-1');
      }}>
        <ListItem.Content>
          <ListItem.Title>{`${item.detail}`}</ListItem.Title>
          <ListItem.Subtitle>{`Amount: ${item.amount}`}</ListItem.Subtitle>
          <ListItem.Subtitle>{`Timestamp: ${item.timestamp}`}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.FlatList
        data={recordList}
        onScroll={scrollHandler}
        onScrollBeginDrag={setOffsetY}
        renderItem={renderItem}
        keyExtractor={(item) => item.id ? item.id.toString() : '-1'}
        bounces={false}
        ListEmptyComponent={
          () => {
            return <ThemedText style={styles.ends}>No records found.</ThemedText>;
          }
        }
        ListHeaderComponent={() => {
          return (
            <Animated.View style={[styles.header, headerAnimatedStyle]} >
              <HeaderView amount={amount}></HeaderView>
            </Animated.View>
          );
        }}
        ListFooterComponent={
          () => {
            return <ThemedText style={styles.ends}>This is the very beginning of the records...</ThemedText>;
          }
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    gap: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  FAB: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  ends: {
    textAlign: 'center',
    paddingBottom: 20,
  }
});
