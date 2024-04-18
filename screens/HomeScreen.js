import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Button } from 'react-native';
import { getFirestore, arrayRemove, setDoc, doc, getDoc, collection, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { LogBox } from 'react-native';

// LogBox.ignoreAllLogs();

const HomeScreen = () => {
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [profiles, setProfiles] = useState([]);
    const firestore = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        initializeSwipes();
        fetchProfiles();
    }, [currentUser.uid]);

    const initializeSwipes = async () => {
        const swipesRef = doc(firestore, 'swipes', currentUser.uid);
        const swipesSnap = await getDoc(swipesRef);

        if (!swipesSnap.exists()) {
            await setDoc(swipesRef, { likes: [], dislikes: [], matches: [] });
        }
    };

    const fetchProfiles = async () => {
        // Get the current user's profile to find out what languages they want to learn
        const currentUserProfileRef = doc(firestore, 'users', currentUser.uid);
        const currentUserProfileSnap = await getDoc(currentUserProfileRef);
        const currentUserProfile = currentUserProfileSnap.data();

        // Retrieve the languages the current user wants to learn
        const languagesToLearn = currentUserProfile.languagesWantToLearn || [];

        const swipesRef = doc(firestore, 'swipes', currentUser.uid);
        const swipesSnap = await getDoc(swipesRef);
        const swipesData = swipesSnap.exists() ? swipesSnap.data() : { likes: [], dislikes: [], matches: [] };

        const usersRef = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersRef);

        const filteredProfiles = usersSnapshot.docs
            .filter(doc => {
                const potentialMatchProfile = doc.data();
                // Filter out current user, users already liked/disliked, and users who can't teach the language the current user wants to learn
                return doc.id !== currentUser.uid &&
                    !swipesData.likes.includes(doc.id) &&
                    !swipesData.matches.includes(doc.id) &&
                    potentialMatchProfile.languagesCanTeach.some(language => languagesToLearn.includes(language));
            })
            .map(doc => ({ id: doc.id, ...doc.data() }));

        setProfiles(filteredProfiles);
        setCurrentProfileIndex(0);
    };

    const handleDecision = async (liked, profileId) => {
        const swipesRef = doc(firestore, 'swipes', currentUser.uid);
        const swipesSnap = await getDoc(swipesRef);
        const swipesData = swipesSnap.data();

        // If the user has been disliked previously, remove them from the dislikes array.
        if (liked && swipesData.dislikes.includes(profileId)) {
            await updateDoc(swipesRef, {
                dislikes: arrayRemove(profileId),
                likes: arrayUnion(profileId)
            });
        } else {
            // Update likes or dislikes array as per the user's decision.
            const update = liked ? { likes: arrayUnion(profileId) } : { dislikes: arrayUnion(profileId) };
            await updateDoc(swipesRef, update);
        }

        if (liked) {
            // Check if the liked user has already liked the current user
            const likedUserSwipesRef = doc(firestore, 'swipes', profileId);
            const likedUserSwipesSnap = await getDoc(likedUserSwipesRef);
            const likedUserSwipesData = likedUserSwipesSnap.exists() ? likedUserSwipesSnap.data() : { likes: [], dislikes: [], matches: [] };

            if (likedUserSwipesData.likes.includes(currentUser.uid)) {
                // Mutual like detected, update matches for both users
                await updateDoc(swipesRef, {
                    matches: arrayUnion(profileId)
                });
                await updateDoc(likedUserSwipesRef, {
                    matches: arrayUnion(currentUser.uid)
                });
                console.log("Match created between", currentUser.uid, "and", profileId);
            } else {
                // Update likes array for the current user
                await updateDoc(swipesRef, {
                    likes: arrayUnion(profileId)
                });
            }
        } else {
            // Update dislikes array for the current user
            await updateDoc(swipesRef, {
                dislikes: arrayUnion(profileId)
            });
        }

        // Go to the next profile
        setCurrentProfileIndex(currentProfileIndex + 1);
    };


    const ProfileView = ({ profileData }) => {
        return (
            <ScrollView style={styles.profileContainer}>
                <Image
                    source={profileData.profilePic ? { uri: profileData.profilePic } : require('../assets/default.png')}
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>{profileData.name}</Text>
                {/* Render other user details as needed */}
                {/* Implementing reviews could be similar to user details */}
                <View style={styles.decisionButtons}>
                    <Button title="Nope" onPress={() => handleDecision(false, profileData.id)} />
                    <Button title="Like" onPress={() => handleDecision(true, profileData.id)} />
                </View>
            </ScrollView>
        );
    };


    return (
        <View style={styles.container}>
            {profiles.length > 0 && currentProfileIndex < profiles.length ? (
                <ProfileView profileData={profiles[currentProfileIndex]} />
            ) : (
                <Text style={styles.noMoreProfilesText}>No more profiles</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileContainer: {
        width: '100%',
        padding: 10,
    },
    profileImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    decisionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    noMoreProfilesText: {
        fontSize: 22,
    },
});

export default HomeScreen;
