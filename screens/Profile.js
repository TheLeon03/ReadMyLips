import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// Define the languages and their flags
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

const LanguageSelector = ({ selectedLanguages, setSelectedLanguages, editable }) => {
    const toggleLanguage = (lang) => {
        if (editable) {
            if (selectedLanguages.includes(lang)) {
                setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
            } else {
                setSelectedLanguages([...selectedLanguages, lang]);
            }
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

const ProfileScreen = () => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [languagesCanTeach, setLanguagesCanTeach] = useState([]);
    const [languagesWantToLearn, setLanguagesWantToLearn] = useState([]);
    const [originalValues, setOriginalValues] = useState({});

    const auth = getAuth();
    const user = auth.currentUser;
    const firestore = getFirestore();

    useEffect(() => {
        if (user) {
            const fetchUserProfile = async () => {
                const userProfileRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(userProfileRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setName(userData.name);
                    setBio(userData.bio);
                    setLanguagesCanTeach(userData.languagesCanTeach);
                    setLanguagesWantToLearn(userData.languagesWantToLearn);
                    setOriginalValues({
                        name: userData.name,
                        bio: userData.bio,
                        languagesCanTeach: [...userData.languagesCanTeach],
                        languagesWantToLearn: [...userData.languagesWantToLearn]
                    });
                }
            };

            fetchUserProfile();
        }
    }, [user, firestore]);

    const handleUpdateProfile = async () => {
        if (user) {
            const userProfileRef = doc(firestore, 'users', user.uid);
            await updateDoc(userProfileRef, {
                name,
                bio,
                languagesCanTeach,
                languagesWantToLearn
            });
            setEditMode(false);
            console.log('Profile updated successfully');
        }
    };

    const handleCancel = () => {
        setName(originalValues.name);
        setBio(originalValues.bio);
        setLanguagesCanTeach(originalValues.languagesCanTeach);
        setLanguagesWantToLearn(originalValues.languagesWantToLearn);
        setEditMode(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // No need to navigate as onAuthStateChanged in App.js will handle it.
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    editable={editMode}
                />

                <Text style={styles.label}>Bio:</Text>
                <TextInput
                    style={styles.input}
                    value={bio}
                    onChangeText={setBio}
                    editable={editMode}
                    multiline
                />

                <Text style={styles.label}>Languages You Can Teach:</Text>
                <LanguageSelector
                    selectedLanguages={languagesCanTeach}
                    setSelectedLanguages={setLanguagesCanTeach}
                    editable={editMode}
                />

                <Text style={styles.label}>Languages You Want to Learn:</Text>
                <LanguageSelector
                    selectedLanguages={languagesWantToLearn}
                    setSelectedLanguages={setLanguagesWantToLearn}
                    editable={editMode}
                />

                {editMode ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </>
                )}

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 50,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#28a745', // Green
    },
    cancelButton: {
        backgroundColor: '#dc3545', // Red
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
    languageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    flagButton: {
        margin: 5,
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
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: 'red', // This makes the button red
    },
});

export default ProfileScreen;
