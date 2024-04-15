import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, FlatList, StyleSheet, View } from 'react-native';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { format } from 'date-fns'; // Ensure you've installed date-fns

const MessageScreen = ({ matchedUserId, onBack }) => {
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const firestore = getFirestore();
    const auth = getAuth();
    const currentUserId = auth.currentUser?.uid;
    const conversationId = [currentUserId, matchedUserId].sort().join('_');

    useEffect(() => {
        if (conversationId) {
            const messagesRef = collection(firestore, 'conversations', conversationId, 'messages');
            const q = query(messagesRef, orderBy('timestamp', 'asc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const fetchedMessages = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date(), // Convert timestamp
                }));
                setMessages(fetchedMessages);
            });
            return () => unsubscribe();
        }
    }, [conversationId, firestore]);

    const sendMessage = async () => {
        if (conversationId && messageText.trim()) {
            await addDoc(collection(firestore, 'conversations', conversationId, 'messages'), {
                senderId: currentUserId,
                receiverId: matchedUserId,
                text: messageText,
                timestamp: serverTimestamp(),
            });
            setMessageText('');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.senderId === currentUserId ? styles.sender : styles.receiver]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timestamp}>{format(item.timestamp, 'PPpp')}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <TextInput
                style={styles.input}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Type a message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5', // Light gray background
    },
    timestamp: {
        marginTop: 4,
        fontSize: 10,
        color: 'white', // Use a subtle color for timestamps
        textAlign: 'right', // Align timestamps to the right
    },
    backButton: {
        marginBottom: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#007bff', // Blue background for the button
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#ffffff', // White text color
    },
    messageBubble: {
        padding: 12,
        borderRadius: 20,
        marginVertical: 4,
        maxWidth: '80%',
        alignSelf: 'flex-end',
    },
    sender: {
        backgroundColor: '#007bff', // Blue background for sender
        marginLeft: '20%',
    },
    receiver: {
        backgroundColor: 'black', // Lighter background for receiver
        alignSelf: 'flex-start',
        marginRight: '20%',
    },
    messageText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 20,
        padding: 10,
        color: '#000000',
        backgroundColor: '#ffffff', // White background for input
        marginBottom: 10,
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#ffffff', // White text color
    },
});

export default MessageScreen;
