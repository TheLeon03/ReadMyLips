import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';

const Profile = ({ navigation }) => {
    const auth = getAuth();
    const db = getFirestore();
    const [userProfile, setUserProfile] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [languagePreferences, setLanguagePreferences] = useState('English');
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            console.log('Current user:', currentUser);
            if (currentUser) {
                const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(doc => {
                    const userData = doc.data();
                    setUserProfile({ ...userData, id: doc.id }); // Store the document ID
                    setName(userData.name);
                    setBio(userData.bio);
                    setLanguagePreferences(userData.languagePreferences || 'English');
                    console.log('User profile data:', userData);
                });
            }
        } catch (error) {
            console.error('Error fetching user profile:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigation.navigate('LoginScreen');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const handleSaveProfile = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser && userProfile.id) {
                const userDoc = doc(db, 'users', userProfile.id);
                await updateDoc(userDoc, { name, bio, languagePreferences });
                setEditing(false);
                // Refresh the profile page by fetching the updated user profile data
                fetchUserProfile();
            }
        } catch (error) {
            console.error('Error updating user profile:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Text style={styles.name}>{userProfile?.name}</Text>
                {!editing && (
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.profileContent}>
                <TextInput
                    style={styles.input}
                    placeholder="Bio"
                    value={bio}
                    onChangeText={setBio}
                    editable={editing}
                    multiline
                />
                <View style={styles.languageContainer}>
                    <Text style={styles.label}>Language Spoken:</Text>
                    <View style={styles.languagePicker}>
                        <RNPickerSelect
                            style={{ inputAndroid: { paddingHorizontal: 10, paddingVertical: 15 } }}
                            placeholder={{ label: 'Select Language Spoken', value: null }}
                            onValueChange={(value) => setLanguagePreferences(value)}
                            value={languagePreferences}
                            items={[
                                { label: 'English 🇺🇸', value: 'English' },
                                { label: 'Spanish 🇪🇸', value: 'Spanish' },
                                { label: 'French 🇫🇷', value: 'French' },
                                // Add more language options as needed
                            ]}
                            disabled={!editing}
                        />
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            {editing && (
                <View style={styles.editContainer}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    editButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileContent: {
        padding: 20,
    },
    input: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    languageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    languagePicker: {
        width: '60%',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    logoutButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    editContainer: {
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: '#f4511e',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default Profile;
