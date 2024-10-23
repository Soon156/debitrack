import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon } from '@rneui/themed';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: useThemeColor({}, 'tabIconSelected'),
            headerStyle: {
                backgroundColor: useThemeColor({}, 'background'),
            },
            headerShadowVisible: false,
            headerTintColor: useThemeColor({}, 'tabIconDefault'),
            tabBarStyle: {
                backgroundColor: useThemeColor({}, 'background'),
            },
        }}>
            <Tabs.Screen
                name="newRecord"
                options={{
                    title: 'New Entry',
                    tabBarIcon: ({ color }) => <Icon size={28} name="add" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Record',
                    tabBarIcon: ({ color }) => <Icon size={28} name="list" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="statistics"
                options={{
                    title: 'Statistics',
                    tabBarIcon: ({ color }) => <Icon size={28} name="analytics" type='ionicon' color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Icon size={28} name="settings" color={color} />,
                    headerShown: false
                }}
            />
        </Tabs>
    );
}
