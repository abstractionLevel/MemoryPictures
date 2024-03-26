import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from './views/folders';
import Folder from './views/folder';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch } from 'react-redux';
import { clickMenu } from './redux/actions/menuFolderActions';
// import * as MediaLibrary from "expo-media-library";
// import { Camera } from 'expo-camera';

const Stack = createStackNavigator();


export default function App() {

	const dispatch = useDispatch();

	const handleDispatch = () => {
		dispatch(clickMenu());
	}

	// async function requestStoragePermission() {

    //     try {
    //         const granted = await PermissionsAndroid.requestMultiple([
    //             PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         ]);
    //         if (
    //             granted['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
    //             granted['android.permission.WRITE_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED
    //         ) {
    //             console.log('Storage permission granted');
    //         } else {
    //             console.log('Storage permission denied');
    //         }
    //     } catch (err) {
    //         console.warn('Error requesting storage permission:', err);
    //     }
    // }

	
	useEffect(() => {
		const getPermissions = async () => {
			// const { status } = await MediaLibrary.requestPermissionsAsync();
			// const { statusCamera } = await Camera.requestCameraPermissionsAsync();

			// if (status === "granted" && statusCamera === "granted") {

			//   console.log("Permission granted");
			// }
		};

		getPermissions();
	}, []);

	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
				<Stack.Screen name="Folder" component={Folder} options={({ route }) => ({
					headerShown: route.params?.showHeader ?? true,
					title: route.params?.title ?? 'Default Title',
					headerTitleStyle: { fontWeight: "bold",color: '#1E90FF' },

					headerRight: () => (
						<TouchableOpacity onPress={handleDispatch}>
							<Entypo style={{ marginLeft: 10 }} name="menu" size={40} color="black" />
						</TouchableOpacity>

					)
				})} />
			</Stack.Navigator>
		</NavigationContainer>

	);

}

