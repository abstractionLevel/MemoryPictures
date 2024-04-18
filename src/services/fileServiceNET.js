import { FOLDERS_DIRECTORY_PATH } from "../constant/constants";
import RNFS from 'react-native-fs';
import { io } from "socket.io-client";
import { IP_SERVER_APP } from '../constant/constants';
import { getDirectoryTree } from "../utils/utils";

const socket = io(IP_SERVER_APP, {
    query: { clientId: "rect-native-12" }
});

const fileServiceNET = {

    fetchDirectories: () => {
        return new Promise((resolve, reject) => {
            socket.emit('getTirectoryTree');
            socket.on('directoryTree', async (directoryTree) => {
                const directories = await directoryTree.filter(item => item);
                resolve(directories);
            });
        });
    },

    sendFile: async (remotePah) => {
        const filePath = '/data/user/0/com.memorypictures/files/documentP/documenti/estate/televisione1.jpg';
        const fileContent = await RNFS.readFile(filePath, 'base64');
        socket.emit('file', {
            filename: 'televisione.jpg',
            content: fileContent,
            pathOfFile: remotePah
        });

        return new Promise(async (resolve, reject) => {
            socket.on('fileRecivied', () => {
                resolve("file recivied");
            });
            socket.on('error', (error) => {
                reject("Error: ", error);
            });
        });
    },

}

export default fileServiceNET;

// export const fetchDirectories = () => {
//     return new Promise((resolve, reject) => {
//         socket.emit('getTirectoryTree');
//         socket.on('directoryTree', async (directoryTree) => {
//             const directories = await directoryTree.filter(item => item);
//             resolve(directories);
//         });
//     });
// };

// export const sendFile = async (remotePah) => {
//     const filePath = '/data/user/0/com.memorypictures/files/documentP/documenti/estate/televisione1.jpg';
//     const fileContent = await RNFS.readFile(filePath, 'base64');
//     socket.emit('file', {
//         filename: 'televisione.jpg',
//         content: fileContent,
//         pathOfFile: remotePah
//     });

//     return new Promise(async (resolve, reject) => {
//         socket.on('fileRecivied', () => {
//             resolve("file recivied");
//         });
//         socket.on('error', (error) => {
//             reject("Error: ", error);
//         });
//     })


// };

export const connectToAppP = () => {
    return new Promise((resolve, reject) => {

        const socket = io(IP_SERVER_APP, {
            query: { clientId: "rect-native-12" }
        });
        let directories = null;
        socket.on('connect', () => {
            console.log('Connesso al server Socket.IO!');

        });

        socket.on('directoryTree', async (directoryTree) => {
            directories = await directoryTree.filter(item => item);
            resolve(directories);
        });

        socket.on('disconnect', () => {
            reject('Disconnesso dal server Socket.IO!');
        });

        socket.on('reciveFile', (data) => {
            RNFS.writeFile(FOLDERS_DIRECTORY_PATH + data.path + '/' + data.name, data.content, 'base64')
                .then((success) => {
                    socket.emit("fileReciviedFromMobile");
                })
                .catch((err) => {
                    console.log(err.message);
                });

        });

        socket.on('getDirectoriesPathFromMobile', async (message) => {
            const directoryTree = await getDirectoryTree("/data/user/0/com.memorypictures/files/documentP/");
            socket.emit("sendDirectoriesToDesk", directoryTree);
        });

        // Chiudi la connessione quando il componente si smonta
        // return () => {
        //     socket.disconnect();
        // };
    });
}




