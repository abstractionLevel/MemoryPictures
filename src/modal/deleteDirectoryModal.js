import React from 'react';
import { View, Modal, Text, Button, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';

const DeleteFolderModal = ({ visible, onClose, folder }) => {

    const handleDeleteFolder = async () => {
        try {
            const folderExists = await RNFS.exists(FOLDERS_DIRECTORY_PATH + '/' + folder);
            if (folderExists) {
                await RNFS.unlink(FOLDERS_DIRECTORY_PATH + '/' + folder);
                onClose();
            } else {
                console.log('Errore', 'La directory non esiste.');
            }
        } catch (error) {
            console.error('Errore durante la cancellazione della directory:', error);
        }
    };

    const onCloseModal = () => {
        onClose();
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
                    <Text>Are you sure delete directory?</Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Delete" onPress={handleDeleteFolder} />
                        </View>
                        <View style={styles.button}>
                            <Button title="Close" onPress={onCloseModal} />
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
        width: '80%',
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
        marginTop: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 5, // Aggiungi spaziatura tra i pulsanti se necessario
    },
});

export default DeleteFolderModal;
