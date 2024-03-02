// matchingAlgorithm.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import SwipeCards from 'react-native-swipe-cards'; // Importing SwipeCards

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { name, image } = this.props;

        return (
            <View style={styles.card}>
                <Image source={image} style={styles.cardImage} />
                <Text style={styles.text}>{name}</Text>
            </View>
        );
    }
}

const MatchingAlgorithm = ({ currentUser, userList }) => {
    const [showLanguagePrompt, setShowLanguagePrompt] = useState(true);
    const [potentialMatches, setPotentialMatches] = useState([]);

    const findMatches = (desiredLanguage) => {
        const matches = userList.filter(user => user.languages.includes(desiredLanguage));
        console.log('Potential Matches:', matches); // Log potential matches to console
        setPotentialMatches(matches);
        setShowLanguagePrompt(false);
    };

    const handleYup = (card) => {
        console.log(`Yup for ${card.name}`);
    };

    const handleNope = (card) => {
        console.log(`Nope for ${card.name}`);
    };

    const renderPotentialMatches = () => {
        if (!potentialMatches || potentialMatches.length === 0) {
            return <Text>No potential matches found.</Text>;
        }

        return (
            <SwipeCards
                cards={potentialMatches}
                renderCard={(cardData) => <Card {...cardData} />}
                handleYup={handleYup}
                handleNope={handleNope}
                loop={false}
                hasMaybeAction={false}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            {showLanguagePrompt ? (
                <View style={styles.languagePrompt}>
                    <Text>Please select a language:</Text>
                    <Button onPress={() => findMatches('English')} title="English" />
                    <Button onPress={() => findMatches('Spanish')} title="Spanish" />
                    {/* Add more buttons for other languages */}
                </View>
            ) : (
                renderPotentialMatches()
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center', // Centered vertically
        alignItems: 'center', // Centered horizontally
        backgroundColor: '#f8f8f8',
    },
    card: {
        width: 300,
        height: 500, // Increased height
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',

    },
    cardImage: {
        width: '100%', // Take up all available width
        height: '70%', // Adjusted for the new card size
        borderTopLeftRadius: 20, // Match the card's border radius
        borderTopRightRadius: 20, // Match the card's border radius
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10, // Added padding
    },
});

export default MatchingAlgorithm;
