import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import wordPairs from '../assets/wordPairs.json'; // Make sure this path is correct

const GameScreen = ({ onExit }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [usedIndices, setUsedIndices] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showLanguage, setShowLanguage] = useState(false);
    const [learningLanguage, setLearningLanguage] = useState('');

    const firestore = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) {
                console.log('No user logged in');
                setIsLoading(false);
                return;
            }
            const userProfileRef = doc(firestore, 'users', currentUser.uid);
            const docSnap = await getDoc(userProfileRef);
            if (docSnap.exists() && docSnap.data().languagesWantToLearn) {
                setCurrentUserProfile(docSnap.data());
                randomizeWordAndLanguage(docSnap.data());
            } else {
                console.log('No profile found for the user or no languages set to learn');
            }
            setIsLoading(false);
        };

        fetchUserProfile();
    }, []);

    const randomizeWordAndLanguage = (profile) => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * wordPairs.length);
        } while (usedIndices.includes(newIndex));
        setCurrentWordIndex(newIndex);
        setUsedIndices([...usedIndices, newIndex]);
        setLearningLanguage(profile.languagesWantToLearn[Math.floor(Math.random() * profile.languagesWantToLearn.length)].toLowerCase());
    };

    const checkTranslation = () => {
        if (!currentUserProfile || !wordPairs[currentWordIndex]) return;

        const word = wordPairs[currentWordIndex][learningLanguage];
        const correctTranslations = currentUserProfile.languagesCanTeach
            .map(lang => wordPairs[currentWordIndex][lang.toLowerCase()])
            .filter(Boolean)
            .map(translation => translation.toLowerCase());

        if (word && correctTranslations.includes(userInput.trim().toLowerCase())) {
            const newScore = score + 1;
            setScore(newScore);
            if (newScore < 50) {
                randomizeWordAndLanguage(currentUserProfile);
            } else {
                setGameOver(true);
            }
            setUserInput('');
        } else {
            setGameOver(true);
        }
    };

    const resetGame = () => {
        setScore(0);
        setUserInput('');
        setUsedIndices([]);
        randomizeWordAndLanguage(currentUserProfile);
        setGameOver(false);
    };

    if (isLoading) {
        return <View style={styles.container}><Text>Loading...</Text></View>;
    }

    return (
        <View style={styles.gameContainer}>
            {!gameOver ? (
                <>
                    <Text style={styles.instructionText}>Translate the word:</Text>
                    <Text style={styles.wordToTranslate}>
                        {wordPairs[currentWordIndex][learningLanguage] || 'No word found'}
                        {showLanguage && ` (${learningLanguage})`}
                    </Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setUserInput}
                        value={userInput}
                        placeholder="Enter translation"
                        autoCapitalize="none"
                    />
                    <Button title="Submit" onPress={checkTranslation} />
                    <Button title="Toggle Language Display" onPress={() => setShowLanguage(!showLanguage)} />
                    <Button title="Exit Game" onPress={onExit} style={{ marginTop: 10 }} />
                </>
            ) : (
                <>
                    <Text style={styles.gameOverText}>
                        {score >= 50 ? "Congratulations! You are a master of this language, why not learn another?" : "Game Over! Your score: " + score}
                    </Text>
                    <Button title="Try Again" onPress={resetGame} />
                    <Button title="Exit" onPress={onExit} />
                </>
            )}
        </View>
    );
};

const resetGame = () => {
    setGameOver(false);
    setScore(0);
    setUserInput('');
    setUsedIndices([]);
    randomizeWordAndLanguage(currentUserProfile);
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',  // Feel free to change this to match your app's theme
    },
    instructionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',  // Dark grey for better readability
    },
    wordToTranslate: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',  // Black for high contrast with background
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',  // Light grey to differentiate from the background
    },
    gameOverText: {
        fontSize: 20,
        color: 'red',
        marginBottom: 10,  // Space before the retry or translation text
    },
    correctTranslationText: {
        fontSize: 16,
        color: 'blue',
        marginBottom: 20,  // Space before the "Try Again" button
    },
    button: {
        backgroundColor: '#007bff',  // Standard button color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,  // Space between buttons for better separation and tapping
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
    },
});

export default GameScreen;

