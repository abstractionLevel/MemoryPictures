import { FOLDERS_DIRECTORY_PATH } from "../constant/constants";
import RNFS from 'react-native-fs';
import { deleteFolder, takeLastElementAfterPoint } from "../utils/utils";


export const writeFile = async (capturedImage, folder, fileName) => {
    if (capturedImage) {
        const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + fileName;
        try {
            await RNFS.copyFile(capturedImage, directoryTo);
        } catch (error) {
            console.error('Errore durante il salvataggio dell\'immagine:', error);
        }
    }
};


export const saveVideo = async (folder) => {
    const contentFolder = await RNFS.readDir("file:///data/user/0/com.memorypictures/cache");
    let file = null;
    for (const item of contentFolder) {
        const element = takeLastElementAfterPoint(item.name);
        if (element === "mp4") {
            file = item;
        }
    }
    const directoryTo = FOLDERS_DIRECTORY_PATH + folder + "/" + file.name;
    try {
        await RNFS.copyFile(file.path, directoryTo);
    } catch (error) {
        console.error('Errore durante il salvataggio dell\'immagine:', error);
    }
    await deleteFolder(contentFolder);

}