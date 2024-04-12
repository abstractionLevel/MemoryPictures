import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import RNFS from 'react-native-fs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CreateFolderModal from '../createFolderModal';
import RenameFolderModal from '../modal/renameFolderModal';
import DeleteFolderModal from '../modal/deleteDirectoryModal';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';
import { connectToAppP } from '../services/fileService';
import { createFolder } from '../utils/utils';

const Folders = ({ navigation }) => {

    const [folders, setFolders] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updateView, setUpdateView] = useState(false);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(false);
    const [isModalRename, setIsModalRename] = useState(false);
    const [isModalDelete, setIsModalDelete] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null);


    const handleCreateFolder = async (folderName) => {
        try {
            const folderPath = FOLDERS_DIRECTORY_PATH + folderName;
            await RNFS.mkdir(folderPath);
            setUpdateView(true);
        } catch (error) {
            console.error('Errore durante la creazione della cartella:', error);
        }
    };

    const checkAndCreateFolder = async () => {
        try {
            const documentPFolderExists = await RNFS.exists(FOLDERS_DIRECTORY_PATH);

            if (!documentPFolderExists) {
                await RNFS.mkdir(FOLDERS_DIRECTORY_PATH);
            } else {
                fetchFolders();
            }
        } catch (error) {
            console.error('Errore durante il controllo/creazione della cartella:', error);
        }
    };

    const fetchFolders = async () => {
        try {
            const documentPFolders = await RNFS.readDir(FOLDERS_DIRECTORY_PATH);
            const folderNames = documentPFolders.map(folder => folder.name);

            setFolders(folderNames);
        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const onPressHeadMenu = (item) => {
        setCurrentFolder(item);
        setVisibleHeadMenu(true);
    };


    const renderFolder = ({ item }) => (
        <TouchableOpacity onLongPress={() => onPressHeadMenu(item)} onPress={() => navigation.navigate("Folder", { folder: item })}>
            <View style={styles.folders}>
                <Entypo style={{ marginLeft: 10 }} name="folder" size={24} color="#1E90FF" />
                <Text style={{ marginLeft: 10, color: "black" }}>{item}</Text>
            </View>
        </TouchableOpacity>
    );

 
    const connect = () => {
        connectToAppP();
    }

    useEffect(() => {
        checkAndCreateFolder();
    }, []);

    useEffect(() => {
        fetchFolders();
        setUpdateView(false);
    }, [updateView]);

    useEffect(() => {
        fetchFolders();
        if (!isModalRename) setVisibleHeadMenu(false);
    }, [isModalRename, isModalDelete,isModalVisible]);

    useEffect(() => {

 
    }, []);

    return (
        <View style={{ flex: 1, marginTop: 10 }}>
            {visibleHeadMenu &&
                <View style={styles.headMenu}>
                    <View>
                        <TouchableOpacity onPress={() => setVisibleHeadMenu(false)}>
                            <AntDesign name="left" size={32} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="edit" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalRename(true)} />
                        <FontAwesome name="trash" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalDelete(true)} />
                    </View>
                </View>
            }

            {folders.length > 0 ? (
                <View>
                    <FlatList
                        data={folders}
                        renderItem={renderFolder}
                        vertical={true}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            ) : (
                <></>
            )}
            <View style={{ width: '100%', alignItems: 'center', marginTop: 100 }}>
                <View style={{ width: '50%' }}>
                    <Button style={{ with: 20 }} title="Add folder" onPress={() => setIsModalVisible(true)} />
                </View>
            </View>
            <View style={{ width: '100%', alignItems: 'center', marginTop: 100 }}>
                <View style={{ width: '50%' }}>
                    <Button style={{ with: 20 }} title="Connect" onPress={() => connect()} />
                </View>
            </View>
            <CreateFolderModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                folderPath={currentFolder}
                onCreateFolder={createFolder}
            />
            <RenameFolderModal
                visible={isModalRename}
                onClose={() => setIsModalRename(false)}
                folder={currentFolder}
            />
            <DeleteFolderModal
                visible={isModalDelete}
                onClose={() => setIsModalDelete(false)}
                folder={currentFolder}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    folders: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    headMenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    modalContainer: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        marginTop: 22,
    },
    folder: {
        fontSize: 20,
        padding: 2,
    },
    folderTree: {
        fontSize: 16,
    },
    openModalButton: {
        fontSize: 20,
        padding: 10,
        backgroundColor: 'lightblue',
    },
});

export default Folders;
