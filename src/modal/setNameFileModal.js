
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Button, StyleSheet } from 'react-native';

const SetFileNameModal = ({ visible, onClose, onSetFileName }) => {

    const [fileName, setfileName] = useState(null);
    const handleCreateFolder = () => {
        if (fileName.trim() !== '') {
            onSetFileName(fileName);
            setfileName('');
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
                    <Text style={{color:'black'}}>Chose a name</Text>
                    <TextInput
                        style={styles.input}
                        value={fileName}
                        onChangeText={setfileName}
                    />
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Save" onPress={handleCreateFolder} />
                        </View>
                        <View style={styles.button}>
                            <Button title="Cancel" onPress={onClose} />
                        </View>
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
        width:'80%',
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
        color: 'black'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5, // Aggiungi spaziatura tra i pulsanti se necessario
    },
});

export default SetFileNameModal;
