import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, FlatList, Keyboard } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// Component for adding/removing languages
const LanguageInput = ({ languages, setLanguages, editable }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddLanguage = () => {
        const language = inputValue.trim();
        if (language && !languages.includes(language)) {
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
            {editable && (
                <TextInput
                    style={styles.input}
                    onChangeText={setInputValue}
                    value={inputValue}
                    onSubmitEditing={handleAddLanguage}
                    returnKeyType="done"
                    placeholder="Add a language"
                />
            )}
            <FlatList
                data={languages}
                renderItem={({ item }) => (
                    <View style={styles.languageTag}>
                        <Text style={styles.languageText}>{item}</Text>
                        {editable && (
                            <TouchableOpacity onPress={() => handleRemoveLanguage(item)}>
                                <Text style={styles.removeLanguage}>×</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const ProfileScreen = () => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [languagesCanTeach, setLanguagesCanTeach] = useState([]);
    const [languagesWantToLearn, setLanguagesWantToLearn] = useState([]);

    const auth = getAuth();
    const firestore = getFirestore();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user) {
                const userProfileRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(userProfileRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setName(userData.name);
                    setBio(userData.bio || '');
                    setLanguagesCanTeach(userData.languagesCanTeach || []);
                    setLanguagesWantToLearn(userData.languagesWantToLearn || []);
                }
            }
        };

        fetchUserProfile();
    }, [user, firestore]);

    const handleUpdateProfile = async () => {
        if (user) {
            const userProfileRef = doc(firestore, 'users', user.uid);
            await updateDoc(userProfileRef, {
                name,
                bio,
                languagesCanTeach,
                languagesWantToLearn,
            });
            alert('Profile Updated Successfully');
            setEditMode(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('Logged out successfully');
        } catch (error) {
            console.error('Logout Error:', error.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Text style={styles.label}>Name:</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} editable={editMode} />

                <Text style={styles.label}>Bio:</Text>
                <TextInput style={styles.input} value={bio} onChangeText={setBio} editable={editMode} multiline />

                <Text style={styles.label}>Languages You Can Teach:</Text>
                <LanguageInput languages={languagesCanTeach} setLanguages={setLanguagesCanTeach} editable={editMode} />

                <Text style={styles.label}>Languages You Want to Learn:</Text>
                <LanguageInput languages={languagesWantToLearn} setLanguages={setLanguagesWantToLearn} editable={editMode} />

                {editMode ? (
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleUpdateProfile}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setEditMode(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={() => setEditMode(true)}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        paddingTop: 70,
        backgroundColor: '#f5f5f5',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        height: 50,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginHorizontal: 20,
    },
    saveButton: {
        backgroundColor: '#28a745', // Green
    },
    cancelButton: {
        backgroundColor: '#dc3545', // Red
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
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
    buttonContainer: {
        flexDirection: 'column',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
