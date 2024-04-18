import React, { useEffect, useState, } from 'react';
import { View, Image, Modal, StyleSheet, TouchableOpacity, FlatList, Text, Alert } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import { shareFile } from '../utils/share';
import { fetchDirectories, sendFileToApp } from '../services/fileServiceNET';

const FullScreenImageModal = ({ isVisible, pathImage, onClose, onPressModalRename, onPressDeleteImage }) => {

    const [directories, setDirectories] = useState(null);
    const [isModalDirectories, setIsModalDirectories] = useState(false);
    const [confirmSendFile, setConfirmSendFile] = useState(false);
    const [currentRemotePath, setCurrentRemotePath] = useState(null);

    const getDirectoriesFromDeskApp = async () => {
        try {
            const directories = await fetchDirectories();
            setDirectories(directories);
        } catch (err) {
            console.log(err);
        }
    };

    function renderDirectoryButtons(tree, spc, path) {

        return tree.map((item, index) => {
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => handleConfirm(path)}>
                        <View style={{ fontSize: 18, marginLeft: spc }}>
                            <Text>|</Text>
                            <Text style={{ fontSize: 16 }}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>
                    {item.directories && renderDirectoryButtons(item.directories, spc += 20, path += item.name + '/')}
                </View>
            )
        });

    }

    const sendFile = async (remotePah) => {
        try {
            const res = await sendFileToApp(remotePah);
            //todo:implementare una notifica con resp ok
            if (res) {
                setIsModalDirectories(false);
            }
        } catch (err) {
            //todo:implementare una notifica con resp ko
            setIsModalDirectories(false);
        }
    };

    const handleConfirm = (path) => {
        setCurrentRemotePath(path);
        sendFile(path);
    }

    const handleCancel = () => {
        setIsModalDirectories(false);

    }

    useEffect(() => {
        if (directories) {
            onClose();
            setIsModalDirectories(true);

        }
    }, [directories])

    return (
        <>
            <Modal visible={isVisible} >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <AntDesign name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: `file://'${pathImage}` }}
                        style={styles.fullScreenImage}
                    />
                </View>
                <View style={styles.actionMenu}>
                    <View style={styles.actionMenuIcons}>
                        <TouchableOpacity onPress={() => shareFile(pathImage)}>
                            <FontAwesome name="share-alt" size={20} color="white" style={{ marginRight: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressModalRename}>
                            <Entypo name="edit" size={20} color="white" style={{ marginRight: 30 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressDeleteImage}>
                            <FontAwesome6 name="trash" size={20} color="white" style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={getDirectoriesFromDeskApp}>
                            <AntDesign name="upload" size={20} color="white" style={{ marginRight: 20 }} />
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
            <Modal
                visible={isModalDirectories}
                animationType="slide"
                onRequestClose={() => setIsModalDirectories(false)}
            >
                <View style={styles.modalDirectories}>
                    <FlatList
                        data={directories}
                        renderItem={({ item }) => (
                            <><TouchableOpacity onPress={() => sendFile(item.name)}>
                                <Text style={styles.folder}>{item.name}</Text>
                            </TouchableOpacity>
                                {item.directories.length > 0 && (
                                    renderDirectoryButtons(item.directories, spc = 20, path = item.name + '/')
                                )}
                            </>
                        )}
                        keyExtractor={(item) => item.name}
                    />
                </View>
            </Modal>
            {confirmSendFile && (
                <Alert
                    title={`Sei sicuro di inviare il file a ${currentRemotePath}?`}
                    confirmText="Conferma"
                    cancelText="Annulla"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    closeIcon: {
        width: 30,
        height: 30,
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    actionMenu: {
        width: '100%',
        height: 50,
        backgroundColor: 'black',
    },
    actionMenuIcons: {
        flexDirection: 'row',
        marginBottom: -60,
        alignContent: 'center',
        justifyContent: 'center'
    },
    folder: {
        fontSize: 20,
        padding: 2,
    },
    folderTree: {
        fontSize: 16,
    },
    modalDirectories: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 22,
    },
});

export default FullScreenImageModal;
