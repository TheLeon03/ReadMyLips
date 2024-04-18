import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Sample language data with flag images (Add actual image paths or URLs for your app)
const languages = [
    { name: 'English', flag: require('../assets/flags/english.jpg') },
    { name: 'Spanish', flag: require('../assets/flags/spanish.jpg') },
    { name: 'French', flag: require('../assets/flags/french.jpg') },
    { name: 'German', flag: require('../assets/flags/german.jpg') },
    { name: 'Italian', flag: require('../assets/flags/italian.jpg') },
    { name: 'Portuguese', flag: require('../assets/flags/portuguese.jpg') },
    { name: 'Russian', flag: require('../assets/flags/russian.jpg') },
    { name: 'Japanese', flag: require('../assets/flags/japanese.jpg') },
    { name: 'Korean', flag: require('../assets/flags/korean.jpg') },
    { name: 'Chinese', flag: require('../assets/flags/chinese.jpg') },
];

const LanguageSelector = ({ selectedLanguages, setSelectedLanguages }) => {
    const toggleLanguage = (lang) => {
        if (selectedLanguages.includes(lang)) {
            setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
        } else {
            setSelectedLanguages([...selectedLanguages, lang]);
        }
    };

    return (
        <View style={styles.languageContainer}>
            {languages.map((language, index) => (
                <TouchableOpacity key={index} onPress={() => toggleLanguage(language.name)} style={styles.flagButton}>
                    <Image source={language.flag} style={styles.flagImage} />
                    {selectedLanguages.includes(language.name) && <View style={styles.checkmark} />}
                    <Text style={styles.flagText}>{language.name}</Text>
                </TouchableOpacity>
            ))}
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
            <LanguageSelector selectedLanguages={languagesCanTeach} setSelectedLanguages={setLanguagesCanTeach} />

            <Text style={styles.label}>Languages You Want to Learn</Text>
            <LanguageSelector selectedLanguages={languagesWantToLearn} setSelectedLanguages={setLanguagesWantToLearn} />

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
    languageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    flagButton: {
        padding: 10,
        alignItems: 'center',
    },
    flagImage: {
        width: 50,
        height: 30,
        marginBottom: 5,
    },
    checkmark: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 20,
        height: 20,
        backgroundColor: 'green',
        borderRadius: 10,
    },
    flagText: {
        fontSize: 12,
    }
});

export default SignupScreen;
