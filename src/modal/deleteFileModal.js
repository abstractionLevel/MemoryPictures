import React from 'react';
import { View, Modal, Text, Button, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs'; // Importa react-native-fs
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';

const DeleteFileModal = ({ visible, onClose, folder, file }) => {

    const handleDeleteFile = async () => {
        try {
            const filePath = `${FOLDERS_DIRECTORY_PATH}/${folder}/${file}`;
            const fileExists = await RNFS.exists(filePath); // Controlla se il file esiste
            if (fileExists) {
                await RNFS.unlink(filePath); // Elimina il file
                onClose();
            } else {
                console.log('Errore', 'Il file non esiste.');
            }
        } catch (error) {
            console.error('Errore durante la cancellazione del file:', error);
        }
    };

    const onCloseModal = () => {
        onClose();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={{color:'black'}}>Are you sure delete file?</Text>
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Delete" onPress={handleDeleteFile} />
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
        marginHorizontal: 5,
    },
});

export default DeleteFileModal;
