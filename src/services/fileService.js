import { FOLDERS_DIRECTORY_PATH } from "../constant/constants";
import RNFS from 'react-native-fs';
import { io } from "socket.io-client";
import { IP_SERVER_APP } from '../constant/constants';
import { getDirectoryTree } from "../utils/utils";


export const writeFile = async (capturedImage, folder, fileName) => {
    if (capturedImage) {
        const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + fileName;
        const imagePathTo = directoryTo;
        try {
            await RNFS.copyFile(capturedImage, imagePathTo);
            console.log('Immagine salvata con successo:', imagePathTo);
        } catch (error) {
            console.error('Errore durante il salvataggio dell\'immagine:', error);
        }
    }
};

export const connectToApp = () => {

    return new Promise((resolve, reject) => {

        const socket = io(IP_SERVER_APP);
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

        socket.on('message', (message) => {
            console.log('Messaggio ricevuto dal server:', message);
        });

        // Chiudi la connessione quando il componente si smonta
        // return () => {
        //     socket.disconnect();
        // };
    });
};

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

        socket.on('messagToNative', (message) => {
            console.log('Messaggio ricevuto dal server:', message);
        });

        socket.on('getDirectoriesPathFromMobile', async (message) => {
            const directoryTree = await getDirectoryTree("/data/user/0/com.memorypictures/files/documentP/");
            socket.emit("sendDirectoriesToDesk",directoryTree);
        });

        // Chiudi la connessione quando il componente si smonta
        // return () => {
        //     socket.disconnect();
        // };
    });
}


export const sendFileToApp = async (remotePah) => {

    return new Promise(async (resolve, reject) => {
        //todo passaree la route del file cliccato
        const filePath = '/data/user/0/com.memorypictures/files/documentP/documenti/televisione1.jpg';
        const fileContent = await RNFS.readFile(filePath, 'base64');
        const socket = io(IP_SERVER_APP);
        socket.emit('file', {
            filename: 'televisione1.jpg',
            content: fileContent,
            pathOfFile: remotePah
        });
        socket.on('message', (message) => {
            resolve('Messaggio ricevuto dal server:', message);
        });
        

        socket.on('error:', (error) => {
            reject(message);
        });
    })

};

