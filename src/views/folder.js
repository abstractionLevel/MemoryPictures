import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text, Button } from 'react-native';
import RNFS from 'react-native-fs';
import CameraComponent from '../components/cameraComponent';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import FullScreenImageModal from '../modal/fullScreenImageModal';
import RenameFileModal from '../modal/renameFileModal';
import DeleteFileModal from '../modal/deleteFileModal';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';
import { getUniqueDatesFromArray } from '../utils/date';
import { useDispatch, useSelector } from 'react-redux';
import { writeFile } from '../services/fileServiceIO';
import { clickMenu } from '../redux/actions/menuFolderActions';
import DocumentPicker from 'react-native-document-picker';
import fileType from 'react-native-file-type';
import { shareFile, shareFolder } from '../utils/share';
import { fileExtensions } from '../utils/fileExtensions';
import { createFolder } from '../utils/utils';
import CreateFolderModal from '../createFolderModal';
import ToastManager, { Toast } from 'toastify-react-native'
import Video from 'react-native-video';
import FullScreenVideoModal from '../modal/fullScreenVideoMoal';

const Folder = ({ navigation, route }) => {

    const folder = route.params.folder;


    const isMenuOpen = useSelector((state) => state.menuFolder.isOpen);
    const [openCamera, setOpenCamera] = useState(false);
    const [images, setImages] = useState(null);
    const [openImageModal, setOpenImageModal] = useState(null);
    const [isVideoClicked, setIsVideoClicked] = useState(null);
    const [imageClicked, setImageClicked] = useState(null);
    const [visibleHeadMenu, setVisibleHeadMenu] = useState(null);
    const [isModalRename, setIsModalRename] = useState(null);
    const [isModalDelete, setIsModalDelete] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [loadView, setLoadView] = useState(null);
    const [isDirectory, setIsDirectory] = useState(false);
    const [isCreateFolderModal, setIsCreateFolderModal] = useState(false);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const dispatch = useDispatch();


    const hideHeader = () => {
        navigation.setParams({ showHeader: false });
    };

    const showHeader = () => {
        navigation.setParams({ showHeader: true });
    };

    const selectImageHandler = async () => {
        try {
            const results = await DocumentPicker.pick({
                type: [DocumentPicker.types.images],
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

    const sortElementByDate = (resp) => {
        const uniqueDate = getUniqueDatesFromArray(resp);
        //ogni data ha un gruppo di file
        let groupedPicture = [];
        uniqueDate.forEach(date => {//per ogni data
            const dateGroup = { date: date, file: [] };//setto la prima data
            resp.forEach(item => {//itero l array d immagin
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

        const documentDirectory = FOLDERS_DIRECTORY_PATH + folder;
        const contentFolder = await RNFS.readDir(documentDirectory);
        let contents = [];

        if (contentFolder) {
            for (const item of contentFolder) {
                try {
                    if (item.isFile()) {
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
                    } else {
                        contents.push({
                            name: item.name,
                            date: new Date().toLocaleDateString(),
                            type: "dir"
                        })
                    }
                } catch (error) {
                    console.error('Errore durante il recupero delle informazioni del file:', error);
                }
            }
        }

        contents.push({ name: "add" })
        sortElementByDate(contents);
    };

    const onPressHeadMenu = async (item) => {
        const stats = await RNFS.stat(FOLDERS_DIRECTORY_PATH + folder + "/" + item);
        if (stats.isDirectory()) {
            setIsDirectory(true);
        }
        setVisibleHeadMenu(true);
        setCurrentFile(item);
    }

    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };


    const renderFile = ({ item }) => {
        const isImage = fileExtensions.some(ext => ext === item.ext);
        if (item.name === "add") {
            return (
                <TouchableOpacity style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', padding: 10 }} onPress={() => setOpenCamera(true)}>
                    <AntDesign name="pluscircleo" size={40} color="black" />
                </TouchableOpacity>
            )
        } else if (isImage) {
            return (
                <TouchableOpacity style={{ padding: 10 }}
                    onLongPress={() => onPressHeadMenu(item.name)}
                    onPress={() => { setOpenImageModal(true); setImageClicked(FOLDERS_DIRECTORY_PATH + folder + "/" + item.name); setCurrentFile(item.name); }}
                >
                    <Image source={{ uri: "file://" + FOLDERS_DIRECTORY_PATH + folder + "/" + item.name }} style={{ width: 100, height: 100, borderRadius: 10, padding: 0 }} />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
                </TouchableOpacity>
            )
        } else if (item.ext === "dir") {
            return (
                <TouchableOpacity style={{ padding: 10 }}
                    onPress={() => navigation.navigate("Folder", { folder: folder + '/' + item.name })}
                // onLongPress={() => onPressHeadMenu(item.name)}//feature to share folder
                >
                    <AntDesign name="folder1" size={100} color="#1E90FF" />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
                </TouchableOpacity>
            )
        } else if (item.ext === "mp4") {
            return (

                <TouchableOpacity style={{ padding: 10 }}
                    onLongPress={() => onPressHeadMenu(item.name)}
                    onPress={() => { setIsVideoClicked(true); setImageClicked(FOLDERS_DIRECTORY_PATH + folder + "/" + item.name); setCurrentFile(item.name); }}
                >
                    <Video
                        style={{ width: 100, height: 100 }}
                        source={{ uri: "file://" + FOLDERS_DIRECTORY_PATH + folder + "/" + item.name }}
                        controls={false}
                        paused={false}
                    />
                    <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
                </TouchableOpacity>
            )
        }
        // else { //other type  of file
        //     return (
        //         <View>
        //             <TouchableOpacity
        //                 onPress={() => openFile(FOLDERS_DIRECTORY_PATH + folder + "/" + item.name)}
        //                 onLongPress={() => onPressHeadMenu(item.name)} style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
        //             >
        //                 <FontAwesome name={
        //                     item.ext === 'pdf' ? 'file-pdf-o' :
        //                         item.ext === 'XLS' || item.error === 'XLSX' ? 'file-excel-o' :
        //                             item.ext === 'TXT ' ? 'file-text-o' : null} size={40} color="red"
        //                 />
        //             </TouchableOpacity>
        //             <Text numberOfLines={2} style={{ width: 80, height: 30, fontSize: 10, textAlign: 'center', color: 'black' }}>{item.name}</Text>
        //         </View>

        //     )
        // }

    }

    const renderItem = ({ item }) => {
        return (<View >
            <Text style={styles.date}>{item.date && item.date}</Text>
            <FlatList
                data={item.file}
                renderItem={renderFile}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
            />
        </View>)
    }

    const showToast = () => {
        Toast.success('🦄 file sent');
    }

    useEffect(() => {
        fetchContentInFolder()
        navigation.setParams({ title: folder });

        return () => {
            setCurrentFile(null);
            setImages(null);
        };
    }, []);

    useEffect(() => {
        openCamera ? hideHeader() : showHeader();

        fetchContentInFolder()
    }, [openCamera]);

    useEffect(() => {
        if (visibleHeadMenu) {
            hideHeader();
            if (isMenuOpen) {
                dispatch(clickMenu())
            }
        } else {
            showHeader();
        }
    }, [visibleHeadMenu])

    useEffect(() => {
        fetchContentInFolder();
        if (!isModalRename) setVisibleHeadMenu(false);
        if (loadView) setLoadView(false);
        if (isMenuOpen) dispatch(clickMenu());
        isVideoClicked ? setVisibleHeadMenu(true) : setVisibleHeadMenu(false)

    }, [isModalRename, isModalDelete, loadView, isCreateFolderModal, isVideoClicked]);

    useEffect(() => {
        fetchContentInFolder();
        navigation.setParams({ title: folder, breadcrumb: folder });
    }, [route.params.folder]);


    return (
        <View style={styles.container}>
            <ToastManager duration={1200} />
            {isVideoClicked && (
                <TouchableOpacity style={styles.closeButton} onPress={() =>setIsVideoClicked(false)}>
                    <View style={{flexDirection:'row'}}>
                    <AntDesign name="left" size={30} color="white" style={{ marginLeft: 30}} />
                    <Text style={{fontSize:12,color:"white",marginLeft:30,textAlign:'center'}}>{currentFile}</Text>
                    </View>
                  
                </TouchableOpacity>
            )}
            {isVideoClicked && (
                <Video
                    style={styles.videoStyle}
                    source={{ uri: `file://'${imageClicked}` }}
                    controls={true}
                    paused={false}
                    resizeMode='contain'
                />
            )}
            {!isVideoClicked && (
                <View style={{ flex: 8 }}>
                    {isMenuOpen &&
                        <View style={styles.menu}>
                            <View style={styles.menuContent}>
                                <TouchableOpacity onPress={selectImageHandler}>
                                    <Text style={styles.menuLabel}>Import Files</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => shareFolder(FOLDERS_DIRECTORY_PATH + folder)}>
                                    <Text style={styles.menuLabel}>Share Folder</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    }
                    {visibleHeadMenu &&
                        <View style={styles.headMenu}>
                            <View>
                                <TouchableOpacity onPress={() => setVisibleHeadMenu(false)}>
                                    <AntDesign name="left" size={30} color="black" style={{ marginLeft: 10 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                {/* { isDirectory && //feature to share folder
                                <TouchableOpacity onPress={() => shareFile(FOLDERS_DIRECTORY_PATH + folder + "/" + currentFile)}>
                                    <AntDesign name="upload" size={30} color="#1E90FF" style={{ marginRight: 30 }} />
                                </TouchableOpacity>
                            } */}
                                <TouchableOpacity onPress={() => shareFile(FOLDERS_DIRECTORY_PATH + folder + "/" + currentFile)}>
                                    <FontAwesome name="share-alt" size={30} color="#1E90FF" style={{ marginRight: 30 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsModalRename(true)}>
                                    <Entypo name="edit" size={30} color="#1E90FF" style={{ marginRight: 30 }} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setIsModalDelete(true)}>
                                    <FontAwesome6 name="trash" size={30} color="#1E90FF" style={{ marginRight: 20 }} />
                                </TouchableOpacity>
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
                                <View style={{ width: '100%', marginTop: 10 }}>
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
                        pathImage={imageClicked}
                        onClose={() => setOpenImageModal(false)}
                        onPressModalRename={() => setIsModalRename(true)}
                        onPressDeleteImage={() => setIsModalDelete(true)}
                        showToast={() => showToast()}
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
                        onCloseFullScreenImage={() => setOpenImageModal(false)}
                    />
                    <CreateFolderModal
                        visible={isCreateFolderModal}
                        onClose={() => setIsCreateFolderModal(false)}
                        onCreateFolder={createFolder}
                        folderPath={folder}
                    />
                </View>)}
            {!openCamera && !isVideoClicked &&
                <View style={{ flex: 2 }}>
                    <View style={{ width: '50%', alignSelf: 'center', marginTop: 30 }}>
                        <Button style={{ with: 20 }} title="Add folder" onPress={() => setIsCreateFolderModal(true)} />
                    </View>
                </View>
            }
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
        marginTop: 30,
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
        fontSize: 16,
        color: 'black',
        marginBottom: 8,
        color: '#1E90FF'
    },
    video: {
        backgroundVideo: {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        },
    },
    videoStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    closeButton: {
        height: 70,
        width: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        zIndex: 400000
    },
});

export default Folder;
