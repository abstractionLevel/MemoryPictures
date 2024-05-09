import RNFS from 'react-native-fs';
import fileType from 'react-native-file-type';
import { fileExtensions } from './fileExtensions';
import RNFetchBlob from 'rn-fetch-blob';
import { zip } from 'react-native-zip-archive';
import { FOLDERS_DIRECTORY_PATH } from '../constant/constants';

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
            } else if (type.ext.includes('dir')) {
                return 'dir';
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

export const getDirectoryTree = async (rootPath) => {
    const stats = await RNFS.stat(rootPath);
    if (!stats.isDirectory()) {
        return null;
    }
    const children = await RNFS.readdir(rootPath);
    const directories = [];
    for (const child of children) {
        const childStats = await RNFS.stat(rootPath + '/' + child);
        if (childStats.isDirectory()) {
            const directory = {
                name: child,
                directories: await getDirectoryTree(rootPath + '/' + child)
            };
            directories.push(directory);
        }
    }
    return directories;
}


export const createFolder = async (path, folderName) => {
    let folderPath = null
    try {
        if (path) {
            folderPath = FOLDERS_DIRECTORY_PATH + path + '/' + folderName;

        } else {
            folderPath = FOLDERS_DIRECTORY_PATH + '/' + folderName;

        }
        await RNFS.mkdir(folderPath);
    } catch (error) {
        console.error('Errore durante la creazione della cartella:', error);
    }
}


export const isInMainDirectory = (folder) => {
    if (folder) {
        const mainRoute = FOLDERS_DIRECTORY_PATH + folder;
        const newRoute = cutLastElementAfterSlash(mainRoute);
        const lastElement = takeLastElementAfterSlash(newRoute);
        return lastElement === "documentP" ? false : true
    }

}

const cutLastElementAfterSlash = (value) => {
    const lastIndexSlash = value.lastIndexOf('/');
    return value.substring(0, lastIndexSlash);
}

const takeLastElementAfterSlash = (value) => {
    const lastIndexSlash = value.lastIndexOf('/');
    return value.substring(lastIndexSlash + 1);
}

export const getValueWithoutLastElement = (value) => {
    const lastIndexSlash = value.lastIndexOf('/');
    return value.substring(0, lastIndexSlash);
}

export const getFileNameFromPath = (path) => {
    let lastIndex = path.lastIndexOf("/");
    return path.substring(lastIndex + 1);
};

export const deleteFolder = async (contentFolder) => {
    for (const item of contentFolder) {
        try {
            await RNFS.unlink(item.path);
            console.log(`Deleted: ${item.name}`);
        } catch (error) {
            console.error(`Error deleting ${item.name}: ${error}`);
        }
    }
}

export const takeLastElementAfterPoint = value => {
    const lastIndexSlash = value.lastIndexOf('.');
    return value.substring(lastIndexSlash + 1);
}