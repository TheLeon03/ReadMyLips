import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import MessageScreen from './MessageScreen'; // Make sure this path is correct

const MatchListScreen = () => {
    const [matchedUsers, setMatchedUsers] = useState([]);
    const [selectedMatchedUserId, setSelectedMatchedUserId] = useState(null);
    const [showMessageScreen, setShowMessageScreen] = useState(false);
    const firestore = getFirestore();
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchMatchedUsers = async () => {
            const swipesRef = doc(firestore, 'swipes', currentUserId);
            const swipesDoc = await getDoc(swipesRef);
            if (swipesDoc.exists()) {
                const matchesData = swipesDoc.data().matches || [];
                const userPromises = matchesData.map(matchedUserId => getDoc(doc(firestore, 'users', matchedUserId)));
                const userDocs = await Promise.all(userPromises);
                const users = userDocs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
                setMatchedUsers(users);
            }
        };

        if (currentUserId) {
            fetchMatchedUsers();
        }
    }, [currentUserId, firestore]);

    const openConversation = (matchedUserId) => {
        setSelectedMatchedUserId(matchedUserId);
        setShowMessageScreen(true);
    };

    const handleBack = () => {
        setShowMessageScreen(false);
    };

    if (showMessageScreen) {
        return <MessageScreen matchedUserId={selectedMatchedUserId} onBack={handleBack} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={matchedUsers}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.matchItem} onPress={() => openConversation(item.id)}>
                        <Text style={styles.matchText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    matchItem: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    matchText: {
        fontSize: 16,
    },
});

export default MatchListScreen;
