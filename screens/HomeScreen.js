import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MatchingAlgorithm from './matchingAlgorithm';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

const HomeScreen = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const auth = getAuth();
    const firestore = getFirestore();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setCurrentUser({
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        languagePreferences: userData.languagePreferences, // Retrieve the language preference
                    });
                    await fetchSwipeData(user.uid, userData.languagePreferences); // Pass the language preference to fetchSwipeData
                }
            }
        };

        const fetchSwipeData = async (userId) => {
            const swipesRef = doc(firestore, 'swipes', userId);
            const docSnap = await getDoc(swipesRef);
            let swipes = { likes: [], dislikes: [] };

            if (docSnap.exists()) {
                swipes = docSnap.data();
            } else {
                console.log("No swipe document found for the user. Creating one...");
                await setDoc(swipesRef, swipes);
            }
            await fetchOtherUsers(userId, swipes);
        };

        const fetchOtherUsers = async (userId, swipes, languagePreferences) => {
            const { likes, dislikes } = swipes;
            const allSwipedUserIds = [...likes, ...dislikes, userId];
            const userQuery = query(collection(firestore, 'users'),
                where('uid', 'not-in', allSwipedUserIds),
                where('languagePreferences', '==', languagePreferences)); // Filter by language preference
            const querySnapshot = await getDocs(userQuery);
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setUserList(users);
        };

        fetchCurrentUser();
    }, [auth, firestore]);

    return (
        <View style={styles.container}>
            {currentUser && <MatchingAlgorithm currentUser={currentUser} userList={userList} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
