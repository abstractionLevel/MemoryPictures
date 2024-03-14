import React, { useEffect, useState } from 'react';
import { View, Modal, TextInput, Button, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs'; // Importa react-native-fs
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';

const RenameFileModal = ({ visible, onClose, folder, file }) => {

    const [newFileName, setNewFileName] = useState(null);

    const handleRenameFile = async () => {
        try {
            await RNFS.moveFile(FOLDERS_DIRECTORY_PATH + folder + '/' + file, FOLDERS_DIRECTORY_PATH + folder + '/' + newFileName);
            setNewFileName(null);
            onClose();
        } catch (error) {
            console.error('Errore durante la rinomina del file:', error);
        }
    }

    const onCloseModal = () => {
        setNewFileName(null);
        onClose();
    }

    useEffect(() => {
        if (file !== null) {
            setNewFileName(file);
        }
    }, [file]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome del file"
                        value={newFileName}
                        onChangeText={setNewFileName}
                    />
                    <View style={styles.buttonContainer}>
                        <View style={styles.button}>
                            <Button title="Fatto" onPress={handleRenameFile} />
                        </View>
                        <View style={styles.button}>
                            <Button title="Annulla" onPress={onCloseModal} />
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

export default RenameFileModal;
