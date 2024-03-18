import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SetFileNameModal from '../modal/setNameFileModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { writeFile } from '../services/fileService';

const CameraComponent = ({ folder, onClose }) => {

    const [cameraPermission, setCameraPermission] = useState();
    const [capturedImage, setCapturedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [colorCircleCamera, setColorCircleCamera] = useState("black");
    const [isCamera, setIsCamera] = useState(true);
    const camera = useRef(null);
    const devices = useCameraDevices();
    const device = devices.back;

    const takePicture = async () => {
        setColorCircleCamera("red");
        try {
            const data = await camera.current.takePhoto({});
            setCapturedImage(data.path);
        } catch (error) {
            console.error('Errore durante la cattura dell\'immagine:', error);
        }
    };

    const saveImageHandler = async (fileName) => {
        await writeFile(capturedImage,folder,fileName)
        // if (capturedImage) {
        //     const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + fileName;
        //     const imagePathTo = directoryTo;
    
        //     try {
        //         await RNFS.copyFile(capturedImage, imagePathTo);
        //         console.log('Immagine salvata con successo:', imagePathTo);
        //     } catch (error) {
        //         console.error('Errore durante il salvataggio dell\'immagine:', error);
        //     }
        // }
    };

    const closeModalCamera = () => {
        setIsModalVisible(false);
        onClose();
    }

    useEffect(() => {
        async function getPermission() {
            const newCameraPermission = await Camera.requestCameraPermission();
        }
        getPermission();
    }, []);

    if (device == null) {
        return <Text>Camera not available</Text>;
    }

    return (
        <View style={styles.container}>
            {capturedImage && (
                <View style={styles.imagePreview}>
                    <Image source={{ uri: `file://'${capturedImage}` }} style={styles.previewImage} />
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapper}>
                            <Button title="Save Picture" onPress={() => setIsModalVisible(true)} style={styles.button} />
                        </View>
                        <View style={styles.buttonWrapper}>
                            <Button title="Cancel" onPress={onClose} style={styles.button} />
                        </View>
                    </View>
                </View>
            )}
            {(!capturedImage && isCamera) && (
                <View style={styles.cameraView} >
                    <View style={{ height: '10%', justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableOpacity onPress={onClose} style={{ marginTop: 30, marginRight: 20 }}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Camera
                        ref={camera}
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        photo={true}
                    />
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Feather name="circle" size={64} color={colorCircleCamera} onPress={takePicture} />
                    </View>
                </View>
            )}
            <SetFileNameModal
                visible={isModalVisible}
                onClose={closeModalCamera}
                onSetFileName={saveImageHandler}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    cameraView: {
        flex: 1,
    },
    camera: {
        height: '80%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 5
    },
    button: {
        width: '100%',
    },
    imagePreview: {
        marginTop: 40,
        flex: 1,
    },
    previewImage: {
        height: '90%',
        marginBottom: 10,
    },
});

export default CameraComponent;
