import { FOLDERS_DIRECTORY_PATH } from "../constant/constants";
import RNFS from 'react-native-fs';

export const writeFile = async (capturedImage,folder,fileName) => {
    if (capturedImage) {
        const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + fileName;
        const imagePathTo = directoryTo;
        try {
            console.log("capturedImage ", capturedImage)
            await RNFS.copyFile(capturedImage, "com.android.externalstorage.documents/document/primary%3Amagazine%2Fmagazine-unlock-01-1.0.60-a473a58255244cb09a468d1c8a6affd7.jpg");
            console.log('Immagine salvata con successo:', imagePathTo);
        } catch (error) {
            console.error('Errore durante il salvataggio dell\'immagine:', error);
        }
    }
};