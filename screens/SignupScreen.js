// SignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const SignUp = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [languagePreferences, setLanguagePreferences] = useState('');

    const auth = getAuth();
    const db = getFirestore();

    const handleSignUp = async () => {
        try {
            // Create user account with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Registered with:', user.email);

            // Store additional user information in Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                email: email,
                name: name,
                bio: bio,
                profilePicture: profilePicture,
                languagePreferences: languagePreferences,
            });

            // Navigate to another screen or reset navigation stack
            navigation.navigate('Home'); // Example navigation destination
        } catch (error) {
            alert(error.message);
            console.error('Error signing up:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={text => setPassword(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={text => setName(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Bio"
                value={bio}
                onChangeText={text => setBio(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Profile Picture URL"
                value={profilePicture}
                onChangeText={text => setProfilePicture(text)}
            />
            <View style={styles.languagePicker}>
                <RNPickerSelect
                    style={{
                        inputAndroid: {
                            paddingHorizontal: 10,
                            paddingVertical: 15,
                            width: '100%',
                            textAlign: 'center',
                        },
                    }}
                    placeholder={{ label: 'Select Language Preferences', value: null }}
                    onValueChange={(value) => setLanguagePreferences(value)}
                    items={[
                        { label: 'English', value: 'English' },
                        { label: 'Spanish', value: 'Spanish' },
                        { label: 'French', value: 'French' },
                        // Add more language options as needed
                    ]}
                />
            </View>
            <TouchableOpacity onPress={handleSignUp} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    languagePicker: {
        width: '100%',
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#3498db',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default SignUp;
