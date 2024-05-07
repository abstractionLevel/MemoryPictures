import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SetFileNameModal from '../modal/setNameFileModal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { writeFile } from '../services/fileServiceIO';
import Timer from 'react-native-timer';
const CameraComponent = ({ folder, onClose }) => {

    const [capturedImage, setCapturedImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [colorCircleCamera, setColorCircleCamera] = useState("white");
    const [isCamera, setIsCamera] = useState(false);
    const [isVideo, setIsVideo] = useState(true);
    const [isRecordVideo, setIsRecordVideo] = useState(false);
    const [isPauseRecordVideo, setIsPauseRecordVideo] = useState(false);
    const [isVisibleIconRecord, setIsVisibleIconRecord] = useState(true);
    const [videoTimer, setVideoTimer] = useState(null);
    const camera = useRef(null);
    const devices = useCameraDevices();
    const device = devices.back;

    const record = async () => {

        await recordVideo();
        await takePicture();

    };

    const recordVideo = async () => {
        if (isVideo) {
            setIsRecordVideo(true);
            if (colorCircleCamera === "white") {
                setColorCircleCamera("red");
                camera.current.startRecording({
                    onRecordingFinished: (video) => console.log(video),
                    onRecordingError: (error) => console.error(error)
                });
            } else if (colorCircleCamera === "red") {
                setColorCircleCamera("white");
                await await camera.current.stopRecording()
            }
        }
    }

    const takePicture = async () => {
        if (isCamera) {
            if (colorCircleCamera === "white") {
                setColorCircleCamera("red")
                const data = await camera.current.takePhoto({});
                setCapturedImage(data.path);
            }
        }
    }

    const stopRecordVideo = async () => {
        setIsRecordVideo(false);
        setIsPauseRecordVideo(false);
        setIsVisibleIconRecord(false);
        setColorCircleCamera("white");
        await await camera.current.stopRecording()
    }

    const pauseRecordVideo = async () => {
        if (!isPauseRecordVideo) {
            setIsPauseRecordVideo(true);
            await camera.current.pauseRecording()
        } else {
            setIsPauseRecordVideo(false);
            await camera.current.resumeRecording()

        }

    }

    const saveImageHandler = async (fileName) => {
        await writeFile(capturedImage, folder, fileName)
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

    useEffect(() => {
        let intervalId;

        if (isRecordVideo && !isPauseRecordVideo) {
            intervalId = setInterval(() => {
                setVideoTimer(seconds => seconds + 1);
                setIsVisibleIconRecord(prevVisible => !prevVisible)
            }, 1000);
        } else if(!isRecordVideo) {
            clearInterval(intervalId);
            setVideoTimer(null);
        }

        return () => clearInterval(intervalId);

    }, [isRecordVideo,isPauseRecordVideo])

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
            {(!capturedImage && (isCamera || isVideo)) && (
                <View style={styles.cameraView} >

                    <View style={{ height: '5%', flexDirection: 'row', marginTop: 10, justifyContent: !isRecordVideo ? 'flex-end' : 'space-between' }}>
                        {isRecordVideo && (
                            <View style={{ flexDirection: 'row',marginLeft:10 }}>
                                {isVisibleIconRecord && !isPauseRecordVideo? (
                                    <FontAwesome name="circle" style={{ marginRight: 10 ,marginTop:2}} size={22} color={"red"} />
                                ) : <FontAwesome name="circle" style={{ marginRight: 10 }} size={22} color={!isPauseRecordVideo  ? "white" : "red"} />}
                               
                                <Text style={{ fontSize: 20 }}>{videoTimer}</Text>
                            </View>
                        )}
                        <TouchableOpacity onPress={onClose} style={{ marginRight: 20 }}>
                            <AntDesign name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Camera
                        ref={camera}
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        video={isVideo}
                        photo={isCamera}
                    />
                    {!isRecordVideo && (
                        <>
                            <View style={{ height: '5%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => { setIsVideo(true), setIsCamera(false) }} style={{ marginRight: 20 }}>
                                    <Text style={{ color: isVideo ? "white" : "gray", fontSize: 24 }}>Video</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { setIsVideo(false), setIsCamera(true) }} style={{ marginRight: 20 }}>
                                    <Text style={{ color: isCamera ? "white" : "gray", fontSize: 24 }}>Photo</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', height: '10%', backgroundColor: 'black' }}>
                                <Feather name="circle" size={64} color={colorCircleCamera} onPress={record} />
                            </View>
                        </>
                    )}
                    {isRecordVideo && (
                        <View style={{ height: '10%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <TouchableOpacity onPress={stopRecordVideo} style={{ marginRight: 20 }}>
                                <FontAwesome name="stop" size={54} color={"black"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pauseRecordVideo} style={{ marginRight: 20 }}>
                                <Feather name={isPauseRecordVideo ? "play-circle" : "pause"} size={54} color={isPauseRecordVideo ? "red" : "black"} />
                            </TouchableOpacity>
                        </View>
                    )}

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
