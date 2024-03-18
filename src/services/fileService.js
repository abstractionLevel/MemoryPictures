import { FOLDERS_DIRECTORY_PATH } from "../constant/constants";
import RNFS from 'react-native-fs';

export const writeFile = async (capturedImage,folder,fileName) => {
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