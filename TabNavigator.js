// TabNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import Profile from './screens/Profile';
import Page from './screens/Friends';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen'; // Assuming you have a SignupScreen component

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
    headerStyle: {
        backgroundColor: '#f4511e', // Customize the header background color
    },
    headerTintColor: '#fff', // Customize the header text color
    headerTitleStyle: {
        fontWeight: 'bold', // Customize the header title text style
    },
};

const HomeStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }} // Hide the header for HomeScreen
        />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
            name="ProfileScreen"
            component={Profile}
            options={{ headerShown: false }} // Hide the header for ProfileScreen
        />
        <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{ headerShown: false }}
        />
    </Stack.Navigator>
);

const FriendStack = () => (
    <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
            name="FriendScreen"
            component={Page}
            options={{ headerShown: false }} // Hide the header for PageScreen
        />
    </Stack.Navigator>
);

const TabNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Friends" component={FriendStack} />
        <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
);

export default TabNavigator;
