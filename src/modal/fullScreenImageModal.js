import React, { useState } from 'react';
import { View, Image, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import  AntDesign from 'react-native-vector-icons/AntDesign'; 

const FullScreenImageModal = ({ isVisible, pathImage, onClose }) => {

    return (
        <Modal visible={isVisible} transparent={true}>
            <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
                <Image
                    source={{ uri: pathImage }} 
                    style={styles.fullScreenImage}
                />
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
});

export default FullScreenImageModal;
