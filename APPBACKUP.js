import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

const firebaseConfig = {
    apiKey: "AIzaSyBTji8n0LeHNIR6gb4X5ar3dZftxap1Y9k",
    authDomain: "readmylips-d5848.firebaseapp.com",
    projectId: "readmylips-d5848",
    storageBucket: "readmylips-d5848.appspot.com",
    messagingSenderId: "894658181916",
    appId: "1:894658181916:web:bfe14227df971448a798d9",
    measurementId: "G-BW7EL79Y5Z"
};

export default function App() {
    return (
        <NavigationContainer>
            <TabNavigator />
        </NavigationContainer>
    );
}
