import Share from 'react-native-share';
import { convertFileToBase64, checkFileType ,convertPdfToBase64} from './utils';

export const shareFile = async (uri) => {

    let fileToShare = uri;

    const fileType = await checkFileType(uri);

    if (fileType.includes("image")) {
        fileToShare = await convertFileToBase64(uri);
    } else if (fileType.includes("pdf")) {
        fileToShare = await convertPdfToBase64(uri)

    } else if (fileType.includes("zip")) {

    }

    const options = {
        title: 'Share file',
        message: 'Simple share with message',
        url: fileToShare,
        subject: "file ",
        type: 'application/pdf',
    };
    Share.open(options)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            err && console.log(err);
        });


}

export const shareFolder = async (uri) => {

    const options = {
        title: 'Share folder',
        message: 'Simple share with message',
        url: `file://${uri}`,
        subject: "share folder ",
        failOnCancel: false
    };
    Share.open(options)
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            err && console.log(err);
        });
}

