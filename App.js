import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DetailsWindow from './DetailsWindow';
// import ImagePicker from 'react-native-image-crop-picker';


export default function App() {
  const [hasPermission, setHasPermission] = useState(null);  
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [detailsWindowVisible, setDetailsWindowVisible] = useState(false);
  const [apiResponseDetails, setApiResponseDetails] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      callApi(photo.uri);
      // Handle the photo, you can save it or do whatever you want with it
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setCapturedPhoto(result); //prevPhotos => [...prevPhotos, result]
      console.log('Captured Photo:', result?.assets[0]?.uri);
      callApi(result?.assets[0]?.uri);
    }
  };

  const callApi = async (imageUri) => {
    try {
      const apiUrl = 'https://plant.id/api/v3/health_assessment';
      const apiKey = '6lNPXHflE3J8zBXST0smIs7YQVI9Htgfl0w5w2qOPmePOWAepY'; 

      const latitude = 49.207;
      const longitude = 16.608;

      const data = {
        images: [imageUri],
        latitude: latitude,
        longitude: longitude,
        similar_images: true,
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Api-Key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);
      setApiResponseDetails(responseData); // Save the details for display
      setDetailsWindowVisible(true); // Show the details window
      // Handle the API response as needed
    } catch (error) {
      console.error('API Error:', error);
      // Handle the error
    }
  };

  useEffect(() => {
    // console.log('Captured Photo:', capturedPhoto?.assets[0]?.uri);
  }, [capturedPhoto]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
        <View style={styles.cameraOverlay}>
          <Pressable style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>🖼️</Text>
          </Pressable>
          <Pressable style={styles.captureButton} onPress={takePicture}>
            <Text style={styles.captureButtonText}>📷</Text>
          </Pressable>
        </View>
      </Camera>
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
        </View>
      )}
      <DetailsWindow
        isVisible={detailsWindowVisible}
        onClose={() => setDetailsWindowVisible(false)}
        responseDetails={apiResponseDetails}
      />
      <StatusBar style="auto" />
    </View>
    // <View style={styles.container}>
    //   <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={cameraRef}>
    //     <View style={styles.cameraOverlay}>
    //       <Pressable style={styles.captureButton} onPress={takePicture}>
    //         <Text style={styles.captureButtonText}>Take Photo</Text>
    //       </Pressable>
    //     </View>
    //   </Camera>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  button: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  captureButton: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonText: {
    fontSize: 30,
    color: 'black',
  },
  previewContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});
