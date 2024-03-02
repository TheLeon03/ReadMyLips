import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

// Dummy data for friends
const friendsData = [
    { id: 1, name: 'Friend 1', language: 'English', profilePic: require('../assets/profile1.png') },
    { id: 2, name: 'Friend 2', language: 'Spanish', profilePic: require('../assets/profile2.jpg') },
    { id: 3, name: 'Friend 3', language: 'French', profilePic: require('../assets/profile3.jpg') },
    // Add more friends as needed
];

const Friends = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Friends</Text>
            {friendsData.map(friend => (
                <View key={friend.id} style={styles.friendContainer}>
                    <Image source={friend.profilePic} style={styles.profilePic} />
                    <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendLanguage}>Speaks: {friend.language}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    friendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    profilePic: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    friendInfo: {
        flex: 1,
    },
    friendName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    friendLanguage: {
        fontSize: 16,
        color: '#888',
    },
});

export default Friends;
