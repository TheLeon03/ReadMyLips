// HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MatchingAlgorithm from './matchingAlgorithm';
import profile1 from '../assets/profile1.png';
import profile2 from '../assets/profile2.jpg';
import profile3 from '../assets/profile3.jpg';

const HomeScreen = () => {
    const currentUser = { id: 1, name: 'Leon', languages: ['English', 'Spanish'] };
    const userList = [
        { id: 2, name: 'Roshag', languages: ['English', 'German'], image: profile1 },
        { id: 3, name: 'Alice', languages: ['Spanish', 'Italian'], image: profile2 },
        { id: 4, name: 'Devan', languages: ['English', 'Spanish'], image: profile3 },
    ];

    return (
        <View style={styles.container}>
            <MatchingAlgorithm currentUser={currentUser} userList={userList} />
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
