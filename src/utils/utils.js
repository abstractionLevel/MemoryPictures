import RNFS from 'react-native-fs';
import fileType from 'react-native-file-type';
import { fileExtensions } from './fileExtensions';
import RNFetchBlob from 'rn-fetch-blob';
import { zip } from 'react-native-zip-archive';

export const renameFileWithExtension = async (filePath) => {
    try {
        const lastDotIndex = filePath.lastIndexOf('.');
        const ext = filePath.substring(lastDotIndex + 1);
        if (!fileExtensions.includes(ext.toLowerCase())) {
            const fType = await fileType(filePath).then(type => type.ext)
            const newFilePath = `${filePath}.${fType}`;
            await RNFS.moveFile(filePath, newFilePath);
        }
    } catch (error) {
        console.error('Errore durante la rinomina del file:', error);
    }
}

export const convertFileToBase64 = async (uri) => {
    const base64Data = await RNFetchBlob.fs.readFile(uri, 'base64');
    return `data:image/png;base64,${base64Data}`;
}


export const convertPdfToBase64 = async (filePath) => {
    let base64Data = await RNFetchBlob.fs.readFile(filePath, 'base64');
    return `data:${'application/pdf'};base64,` + base64Data;
}

export const checkFileType = async (filePath) => {

    return await fileType(filePath)
        .then(type => {
            if (fileExtensions.includes(type.ext)) {
                return 'image';
            } else if (type.ext.includes('pdf')) {
                return 'pdf';
            } else if (type.ext.includes('zip')) {
                return 'zip';
            } else {
                return 'altro';
            }
        })
        .catch(error => console.log("error: ", error))
};

export const zipFolder = async (folderPath) => {
    try {
        const parts = folderPath.split('/');
        folderName = parts[parts.length - 1];
        // ottiene  tutti i file nella cartella
        const files = await RNFS.readDir(folderPath);
        const filePaths = files.map(file => file.path);
        const outputZipPath = `${RNFS.CachesDirectoryPath}/${folderName}.zip`;
        await zip(filePaths, outputZipPath);
        return outputZipPath
    } catch (error) {
        console.error('Errore durante la zip della cartella:', error);
        return null;
    }
};

