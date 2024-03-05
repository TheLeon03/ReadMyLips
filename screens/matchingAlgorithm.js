import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import SwipeCards from 'react-native-swipe-cards';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

class Card extends React.Component {
    render() {
        const { name, image } = this.props;
        return (
            <View style={styles.card}>
                <Image source={{ uri: image }} style={styles.cardImage} />
                <Text style={styles.text}>{name}</Text>
            </View>
        );
    }
}

const MatchingAlgorithm = ({ currentUser, userList }) => {
    const [showLanguagePrompt, setShowLanguagePrompt] = useState(true);
    const firestore = getFirestore(); // Initialize Firestore

    const handleSwipe = async (swipedUserId, liked) => {
        const swipesRef = doc(firestore, 'swipes', currentUser.uid);
        const updateField = liked ? 'likes' : 'dislikes';
        await updateDoc(swipesRef, {
            [updateField]: arrayUnion(swipedUserId)
        });

        if (liked) {
            checkForMatch(currentUser.uid, swipedUserId);
        }
    };

    const checkForMatch = async (userId, swipedUserId) => {
        const userSwipesRef = doc(firestore, 'swipes', userId);
        const swipedUserSwipesRef = doc(firestore, 'swipes', swipedUserId);
        const [userSwipesSnap, swipedUserSwipesSnap] = await Promise.all([
            getDoc(userSwipesRef),
            getDoc(swipedUserSwipesRef)
        ]);

        if (userSwipesSnap.exists() && swipedUserSwipesSnap.exists()) {
            const userSwipesData = userSwipesSnap.data();
            const swipedUserSwipesData = swipedUserSwipesSnap.data();

            if (userSwipesData.likes.includes(swipedUserId) && swipedUserSwipesData.likes.includes(userId)) {
                // It's a match
                await Promise.all([
                    updateDoc(userSwipesRef, {
                        matches: arrayUnion(swipedUserId)
                    }),
                    updateDoc(swipedUserSwipesRef, {
                        matches: arrayUnion(userId)
                    })
                ]);
                console.log(`It's a match between ${userId} and ${swipedUserId}!`);
            }
        }
    };

    const renderPotentialMatches = () => {
        if (showLanguagePrompt) {
            return (
                <View style={styles.languagePrompt}>
                    <Text>Please select a language:</Text>
                    <Button onPress={() => setShowLanguagePrompt(false)} title="Show Matches" />
                </View>
            );
        } else if (userList.length === 0) {
            return <Text>No potential matches found.</Text>;
        } else {
            return (
                <SwipeCards
                    cards={userList}
                    renderCard={(cardData) => <Card {...cardData} />}
                    keyExtractor={(cardData) => cardData.uid}
                    handleYup={(card) => handleSwipe(card.uid, true)}
                    handleNope={(card) => handleSwipe(card.uid, false)}
                    loop={false}
                />
            );
        }
    };

    return (
        <View style={styles.mainContainer}>
            {renderPotentialMatches()}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    card: {
        width: 300,
        height: 500,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardImage: {
        width: '100%',
        height: '70%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
    },
    languagePrompt: {
        padding: 20,
    },
});

export default MatchingAlgorithm;
