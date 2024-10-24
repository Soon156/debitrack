import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon } from '@rneui/themed';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect } from 'react';
import { signInSilent } from '@/script/googleAPIs';

export default function TabLayout() {
    
    useEffect(() => {
        const signIn = async () => {
            await signInSilent();
        };
        signIn();
    }, []);

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
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color }) => <Icon size={28} name="home" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="recordList"
                options={{
                    title: 'Records',
                    tabBarIcon: ({ color }) => <Icon size={28} name="list" color={color} />,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="newRecord"
                options={{
                    title: 'New Record',
                    tabBarIcon: ({ color }) => <Icon size={28} name="add" color={color} />,
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
