import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

const CreateFolderModal = ({ visible, onClose, onCreateFolder }) => {
    const [folderName, setFolderName] = useState('');

    const handleCreateFolder = () => {
        if (folderName.trim() !== '') {
            onCreateFolder(folderName);
            setFolderName('');
            onClose();
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Inserisci il nome della cartella</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome della cartella"
                        value={folderName}
                        onChangeText={setFolderName}
                    />
                    <View style={styles.buttonContainer}>
                        <Button title="Fatto" onPress={handleCreateFolder} />
                        <Button title="Annulla" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default CreateFolderModal;
