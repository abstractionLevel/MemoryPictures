import React, { useState } from 'react';
import { View, Image, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import { shareFile } from '../utils/share';
import RenameFileModal from './renameFileModal';

const FullScreenImageModal = ({ isVisible, pathImage, onClose,onPressModalRename,onPressDeleteImage }) => {


    return (
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
                </View>
            </View>
        </Modal>
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
    }
});

export default FullScreenImageModal;
