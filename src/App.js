import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from './views/folders';
import Folder from './views/folder';
import { TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../src/redux/reducers/rootReducer'; // Importa il tuo rootReducer

// import * as MediaLibrary from "expo-media-library";
// import { Camera } from 'expo-camera';

const Stack = createStackNavigator();
const store = createStore(rootReducer); // Crea lo store utilizzando il rootReducer


export default function App() {

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
		<Provider store={store}> 
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
					<Stack.Screen name="Folder" component={Folder} options={({ route }) => ({
						headerShown: route.params?.showHeader ?? true,
						title: route.params?.title ?? 'Default Title',
						headerTitleStyle: { fontWeight: "bold" },

						headerRight: () => (
							<TouchableOpacity onPress={() => console.log("ciao")}>
								<Entypo style={{ marginLeft: 10 }} name="menu" size={40} color="black" />
							</TouchableOpacity>

						)
					})} />
				</Stack.Navigator>
			</NavigationContainer>
		</Provider>

	);

}

