import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Button, FlatList, TouchableOpacity, Image, Text } from 'react-native';
import RNFS from 'react-native-fs';
import CameraComponent from '../components/cameraComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import ImagePicker from 'react-native-image-crop-picker';
import FullScreenImageModal from '../modal/fullScreenImageModal';
import RenameFileModal from '../modal/renameFileModal';
import DeleteFileModal from '../modal/deleteFileModal';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';
import { getUniqueDatesFromArray } from '../utils/date';
import { useDispatch, useSelector } from 'react-redux';
import { writeFile } from '../services/fileService';
import { clickMenu } from '../redux/actions/menuFolderActions';
import DocumentPicker from 'react-native-document-picker';
import fileType from 'react-native-file-type'

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;
    const isMenuOpen = useSelector((state) => state.menuFolder.isOpen);
    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(null);
    const [imageClicked, setImageClicked] = useState(null);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);
    const [isModalRename, setIsModalRename] = useState(null);
    const [isModalDelete, setIsModalDelete] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loadView, setLoadView] = useState(null);
    const dispatch = useDispatch();
    const imageExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'tif'];


    const hideHeader = () => {
        navigation.setParams({ showHeader: false });
    };

    const showHeader = () => {
        navigation.setParams({ showHeader: true });
    };

    const selectImageHandler = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                allowMultiSelection: true
            });
            saveFIle(results);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('Selezione del file annullata');
            } else {
                console.log('Errore durante la selezione del file:', error);
            }
        }
    };

    const saveFIle = async (files) => {
        for (const file of files) {
            await writeFile(file.uri, folder, file.name)
        }
        setLoadView(true);
    }

    const groupedFotoByDate = (resp) => {
        const uniqueDate = getUniqueDatesFromArray(resp);
        let groupedPicture = [];
        uniqueDate.forEach(date => {//per ogni data
            const dateGroup = { date: date, file: [] };//setto la prima data
            resp.forEach(item => {//itero l array d immagini
                if (date === item.date) {
                    dateGroup.file.push({ name: item.name, ext: item.type });//setto l immagine che combacia con la data
                }
            });
            groupedPicture.push(dateGroup);
        });
        groupedPicture.sort((a, b) => {
            if (a.date && b.date) {
                const dateA = new Date(a.date.split('/').reverse().join('-'));
                const dateB = new Date(b.date.split('/').reverse().join('-'));
                return dateB - dateA;
            }
        });
        setImages(groupedPicture);
    }

    const fetchContentInFolder = async () => {
        try {
            const documentDirectory = FOLDERS_DIRECTORY_PATH + folder;
            const contentFolder = await RNFS.readDir(documentDirectory);
            let contents = [];
            if (contentFolder) {
                for (const item of contentFolder) {

                    try {
                        const fileInfo = await RNFS.stat(item.path);
                        const fType = await fileType(item.path).then(type => type.ext)
                        const date = new Date(fileInfo.mtime);
                        const formattedDate = date.toLocaleDateString();
                        if (item) {
                            contents.push({
                                name: item.name,
                                date: formattedDate,
                                type: fType
                            })
                        }
                    } catch (error) {
                        console.error('Errore durante il recupero delle informazioni del file:', error);
                    }
                }
            }

            contents.push({ name: "add" })
            groupedFotoByDate(contents);

        } catch (error) {
            console.error('Errore durante il recupero delle cartelle:', error);
        }
    };

    const onPressHeadMenu = (item) => {
        setVisibleHeadMenu(true);
        setCurrentFile(item);
    }

    const renderImage = ({ item }) => {
        const isImage = imageExtensions.some(ext => ext === item.ext);
        if (item.name === "add") {
            return (
                <TouchableOpacity style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => setOpenCamera(true)}>
                    <AntDesign name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            )
        } else if (isImage) {
            return (
                <TouchableOpacity style={{ padding: 2 }} onLongPress={() => onPressHeadMenu(item)} onPress={() => { setOpenImageModal(true); setImageClicked(FOLDERS_DIRECTORY_PATH + folder + "/" + item.name) }}>
                    <Image source={{ uri: `file://'${FOLDERS_DIRECTORY_PATH + folder + "/" + item.name}` }} style={{ width: 100, height: 100, borderRadius: 10, padding: 0 }} />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
                </TouchableOpacity>
            )
        } else if (item.ext === "pdf") {
            return (
                <View>
                    <TouchableOpacity style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }} onPress={() => setOpenCamera(true)}>
                        <AntDesign name="pdffile1" size={40} color="red" />
                    </TouchableOpacity>
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
                </View>


            )
        }

    }

    const renderItem = ({ item }) => {
        return (<View>
            <Text style={styles.date}>{item.date && item.date}</Text>
            <FlatList
                data={item.file}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
            />
        </View>)
    }

    useEffect(() => {
        fetchContentInFolder()
        navigation.setParams({ title: folder });

    }, []);

    useEffect(() => {
        openCamera ? hideHeader() : showHeader();

        fetchContentInFolder()
    }, [openCamera]);

    useEffect(() => {
        visibleHeadMenu ? hideHeader() : showHeader();
    }, [visibleHeadMenu])

    useEffect(() => {
        fetchContentInFolder();
        if (!isModalRename) setVisibleHeadMenu(false);
        if (loadView) setLoadView(false);
        if (isMenuOpen) dispatch(clickMenu());
    }, [isModalRename, isModalDelete, loadView]);

    return (
        <View style={styles.container}>
            {isMenuOpen &&
                <View style={styles.menu}>
                    <View style={styles.menuContent}>
                        <TouchableOpacity onPress={selectImageHandler}>
                            <Text style={styles.menuLabel}>Import Files</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            }
            {visibleHeadMenu &&
                <View style={styles.headMenu}>
                    <View>
                        <TouchableOpacity onPress={() => setVisibleHeadMenu(false)}>
                            <AntDesign name="left" size={32} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Entypo name="edit" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalRename(true)} />
                        <FontAwesome6 name="trash" size={32} color="black" style={{ marginRight: 20 }} onPress={() => setIsModalDelete(true)} />
                    </View>
                </View>
            }

            {openCamera ? (
                <View style={{ flex: 1 }}>
                    <CameraComponent folder={folder} onClose={() => setOpenCamera(false)} />
                </View>
            ) : (
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <View style={{ justifyContent: 'center', width: '90%' }}>
                        <View style={{ width: '100%', marginTop: 10, alignItems: 'center' }}>
                            <FlatList
                                data={images}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>
            )}
            <FullScreenImageModal
                isVisible={openImageModal}
                pathImage={imageClicked} onClose={() => setOpenImageModal(false)}
            />
            <RenameFileModal
                visible={isModalRename}
                onClose={() => setIsModalRename(false)}
                file={currentFile}
                folder={folder}
            />
            <DeleteFileModal
                visible={isModalDelete}
                onClose={() => setIsModalDelete(false)}
                folder={folder}
                file={currentFile}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    camera: {
        flex: 1,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginBottom: 20,
    },
    headMenu: {
        marginTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    date: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8
    },
    menu: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    menuContent: {
        width: 150,
        height: 200,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginRight: 5,
        zIndex: 100,
        padding: 4,
        backgroundColor: 'white'

    },
    menuLabel: {
        fontSize: 18,

    }
});

export default Folder;
