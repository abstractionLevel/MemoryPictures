import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Folders from './views/folders';
import Folder from './views/folder';
// import * as MediaLibrary from "expo-media-library";
// import { Camera } from 'expo-camera';



const Stack = createStackNavigator();


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
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Folders" component={Folders} options={{ title: 'Folders' }} />
        <Stack.Screen name="Folder" component={Folder} options={({ route }) => ({
          headerShown: route.params?.showHeader ?? true, 
          title: route.params?.title ?? 'Default Title',
        })} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}

