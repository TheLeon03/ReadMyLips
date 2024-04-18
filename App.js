// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import TabNavigator from './TabNavigator';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBTji8n0LeHNIR6gb4X5ar3dZftxap1Y9k",
  authDomain: "readmylips-d5848.firebaseapp.com",
  projectId: "readmylips-d5848",
  storageBucket: "readmylips-d5848.appspot.com",
  messagingSenderId: "894658181916",
  appId: "1:894658181916:web:bfe14227df971448a798d9",
  measurementId: "G-BW7EL79Y5Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2ecc71' }]}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe;
  }, [auth, initializing]);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  button: {
    width: '80%',
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;