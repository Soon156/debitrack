import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { ThemedView } from '@/components/ThemedView';
import RecordModal from '@/constants/Modal';
import { ListItem } from '@rneui/themed';
import { ThemedText } from '../../components/ThemedText';
import HeaderView from '../../components/HeaderView';
import { fetchRecords, getAmountByDateRange } from '@/script/RecordDB';
import { useFocusEffect } from 'expo-router';

const HEADER_HEIGHT = 200;

export default function RedordListPage() {

    const [records, setRecords] = useState<RecordModal[]>([]);
    const [amount, setAmount] = useState<number>(0);

    async function setup() {
        var result = await fetchRecords();
        setRecords(result);
        var amountResult = await getAmountByDateRange('today');
        console.log(amountResult);
        setAmount(amountResult);
    }

    useFocusEffect(
        useCallback(() => {
            setup();
        }, []),)

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
                data={records}
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
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: HEADER_HEIGHT,
        overflow: 'hidden',
    },
    ends: {
        textAlign: 'center',
        paddingBottom: 20,
    }
});
