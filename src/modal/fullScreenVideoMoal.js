import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import AntDesign from 'react-native-vector-icons/AntDesign';


const FullScreenVideoModal = ({ isVisible, onClose, pathVideo }) => {

    return (
        <Modal visible={isVisible}  >
            <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>
                <View  style={{ height: "90%", width: "90%",justifyContent: 'center', alignItems: 'center',}}>
                    <Video
                        style={{ height: "100%", width: "100%" }}
                        source={{ uri: `file://'${pathVideo}` }}
                        controls={true}
                        paused={false}
                    />
                </View>

            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalContainer: {
        width:'100%',
        height:'100%',
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

});

export default FullScreenVideoModal;