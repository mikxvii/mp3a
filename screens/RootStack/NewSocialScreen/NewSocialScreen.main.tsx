import React, { useState, useEffect } from "react";
import { Platform, View, Text} from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import { getApp } from "firebase/app";

import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.
    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState<string>();
  const [image, setImage] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [name, setName] = useState<string>();
  const [sbVisible, setSbVisible] = useState<boolean>(false);
  // For date time picker modal
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false); 
  const onToggleSnackBar = () => setSbVisible(true);

  const onDismissSnackBar = () => setSbVisible(false);

  const onChangeName = (text: string) => {
    setName(text);
  };

  const onChangeLocation = (text: string) => {
    setLocation(text);
  };

  const onChangeDesc = (text: string) => {
    setDescription(text);
  }

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    date.setSeconds(0);
    setDate(date);
    hideDatePicker();
    console.log(date);
  };

  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html

  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.
    if (!name || !location || !description || !date || !image) {
      onToggleSnackBar();
      return;
    }

    // Otherwise, proceed onwards with uploading the image, and then the object.

    try {

      // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
      // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!

      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.
      const object: Blob = await getFileObjectAsync(image) as Blob;

      // (1) Write the image to Firebase Cloud Storage. Make sure to do this
      // using an "await" keyword, since we're in an async function. Name it using
      // the uuid provided below.
      const db = getFirestore();
      const storage = getStorage(getApp());
      const storageRef = ref(storage, uuid() + ".jpg");
      const result = await uploadBytes(storageRef, object);
      // (2) Get the download URL of the file we just wrote. We're going to put that
      // download URL into Firestore (where our data itself is stored). Make sure to
      // do this using an async keyword.
      const downloadURL = await getDownloadURL(result.ref);
      // (3) Construct & write the social model to the "socials" collection in Firestore.
      // The eventImage should be the downloadURL that we got from (3).
      // Make sure to do this using an async keyword.
      const socialDoc: SocialModel = {
        eventName: name,
        eventDate: date,
        eventLocation: location,
        eventDescription: description,
        eventImage: downloadURL,
      };
      const socialRef = collection(db, 'socials');
      await setDoc(doc(socialRef), socialDoc);
      // (4) If nothing threw an error, then go back to the previous screen.
      //     Otherwise, show an error.
      navigation.goBack();
    } catch (e) {
      console.log("Error while writing social:", e);
    }
    return;
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };
  

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        <TextInput
          label="Name of Event"
          value={name}
          onChangeText={onChangeName}
        />  
        <TextInput
          label="Location of Event"
          value={location}
          onChangeText={onChangeLocation}
        />  
        <TextInput
          label="Description"
          value={description}
          onChangeText={onChangeDesc}
        />  
        <Button mode="outlined" onPress={showDatePicker}>
            <Text>Choose a Date</Text>
        </Button>
        <Button mode="outlined" onPress={pickImage}>
            <Text>Choose an Image</Text>
        </Button>
        <Button mode="outlined" onPress={saveEvent}>
            <Text>Submit</Text>
        </Button>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Snackbar
        visible={sbVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Got it'
        }}>
        <Text>Fill in all fields!</Text>
      </Snackbar>
      </View>
    </>
  );
}
