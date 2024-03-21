import Share from 'react-native-share';


export const shareContent = async (uri) => {
    try {
        const options = {
            url: `file://${uri}`,
        };
        await Share.open(options);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

