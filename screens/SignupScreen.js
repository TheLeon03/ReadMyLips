import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Keyboard, ScrollView } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// List of available languages for validation
const availableLanguages = ['English', 'Spanish', 'French', 'German']; // Extend this list as needed

const LanguageInput = ({ languages, setLanguages, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddLanguage = () => {
        const language = inputValue.trim();
        if (language && availableLanguages.includes(language) && !languages.includes(language)) {
            setLanguages([...languages, language]);
            setInputValue('');
            Keyboard.dismiss();
        }
    };

    const handleRemoveLanguage = (language) => {
        setLanguages(languages.filter((lang) => lang !== language));
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={setInputValue}
                value={inputValue}
                onSubmitEditing={handleAddLanguage}
                returnKeyType="done"
                placeholder={placeholder}
                autoCapitalize="none"
            />
            <FlatList
                data={languages}
                renderItem={({ item }) => (
                    <View style={styles.languageTag}>
                        <Text style={styles.languageText}>{item}</Text>
                        <TouchableOpacity onPress={() => handleRemoveLanguage(item)}>
                            <Text style={styles.removeLanguage}>×</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={(item) => item}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.languageList}
            />
        </View>
    );
};

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [languagesCanTeach, setLanguagesCanTeach] = useState([]);
    const [languagesWantToLearn, setLanguagesWantToLearn] = useState([]);

    const auth = getAuth();
    const firestore = getFirestore();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(firestore, 'users', user.uid), {
                email,
                name,
                languagesCanTeach,
                languagesWantToLearn,
            });
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Error signing up:', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" />

            <Text style={styles.label}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>Languages You Can Teach</Text>
            <LanguageInput languages={languagesCanTeach} setLanguages={setLanguagesCanTeach} placeholder="Add a language and press enter" />

            <Text style={styles.label}>Languages You Want to Learn</Text>
            <LanguageInput languages={languagesWantToLearn} setLanguages={setLanguagesWantToLearn} placeholder="Add a language and press enter" />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    languageTag: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        padding: 8,
        marginRight: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    languageText: {
        fontSize: 14,
    },
    removeLanguage: {
        marginLeft: 5,
        color: '#333',
        fontWeight: 'bold',
    },
    languageList: {
        marginTop: 10,
        flexGrow: 0, // Prevents the list from taking up unnecessary space
    },
});

export default SignupScreen;
