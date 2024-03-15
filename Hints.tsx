/* This file contains a walkthrough of how Promises & Async/Await work in practice.
   This will most likely be very helpful for MP 3A.

   Here's what you should do –

    1. First, read this high-level overview of networking in React Native. This example
        involves making a network request to download a list of movies from a remote JSON source
        and using it in state. Pay close attention to how the async/await keywords are used.

        https://reactnative.dev/docs/network

    2. After reading that, I'd recommend skimming over how promises work. 

        Promises in 100 Seconds:
        https://www.youtube.com/watch?v=RvYYCGs45L4

        Promises in a Lengthy, but Useful, Medium Article:
        https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-promise-27fc71e77261

    3. Now, you're ready to dive into the example in this file. If needed, reference the Firebase documentation:
    
       Uploading Images to Cloud Storage:
        https://firebase.google.com/docs/storage/web/upload-files#upload_from_a_blob_or_file

       Adding a Document to Cloud Firestore:
        https://firebase.google.com/docs/firestore/manage-data/add-data#set_a_document

       ...but everything you need to write your social object to Firestore should be in this file
       ...reminder: make sure to use async/await, and not the nested promises approach!

*/

import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getApp } from "firebase/app";
import { SocialModel } from "../../../models/social";
import { getFileObjectAsync, uuid } from "../../../Utils";

// This is the verbose, old way of doing things
// Aniruth's note: This is the Firebase v8 way of doing things. It's not what we are using.
// We are using v9, which is more modular (more imports, but smaller bundles).
// If you want to transpile this to v9, you can, but I'm too lazy to.
const regularNetworkRequests = () => {
  getFileObjectAsync(eventImage).then((object) => {
    firebase
      .storage()
      .ref()
      .child(uuid() + ".jpg")
      .put(object as Blob)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          const doc: SocialModel = {
            eventName: eventName,
            eventDate: eventDate.getTime(),
            eventLocation: eventLocation,
            eventDescription: eventDescription,
            eventImage: downloadURL,
          };
          firebase
            .firestore()
            .collection("socials")
            .doc()
            .set(doc)
            .then(() => {
              console.log("Finished social creation.");
            });
        });
      });
  });
};

// This is the clean, new way of doing things
// Aniruth's Note: This is the Firebase v9 way of doing things.
// This is the version that we are using (which is modular).
// Also note that this isn't exactly the solution. Close, but not quite.
// Make sure you read through the Firebase documentation to understand what's going on and what's missing.
const asyncAwaitNetworkRequests = async () => {
  const object = await getFileObjectAsync(eventImage);
  const db = getFirestore();
  const storage = getStorage(getApp());
  const storageRef = ref(storage, uuid() + ".jpg");
  const result = await uploadBytes(storageRef, object);
  const downloadURL = await getDownloadURL(result.ref);
  const socialDoc: SocialModel = {
    eventName: eventName,
    eventDate: eventDate.getTime(),
    eventLocation: eventLocation,
    eventDescription: eventDescription,
    eventImage: downloadURL,
  };
  await setDoc(socialRef, socialDoc);
  console.log("Finished social creation.");
};

const thePlaceWhereWeUseIt = () => {
  // If we have promises/callbacks within a function,
  // the function will return immediately, and our code that lies
  // within those callbacks will execute at some point later.
  regularNetworkRequests();

  // If we declare a function as async/await, then the function will
  // return a promise. We can either choose to ignore it, or we can
  // explicitly deal with the promise if we want to be notified
  // when it succeeds or fails.

  // Option A: Ignore the promise. When we want to put this sort
  // of request in a button onPress method, we can usually just do
  // this.
  asyncAwaitNetworkRequests();

  // Option B: Handle the promise.
  asyncAwaitNetworkRequests()
    .then(() => {
      console.log("our async function finished running.");
    })
    .catch((e) => {
      console.log("our async function threw an error:", e);
    });
};
