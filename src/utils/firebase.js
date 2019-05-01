import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';

const auth_config = {
  apiKey: "AIzaSyDccpTJY3I8qBzbajGXF0VqKyRVtuZaJU0",
  authDomain: "textbookexchange-d5876.firebaseapp.com",
  databaseURL: "https://textbookexchange-d5876.firebaseio.com",
  projectId: "textbookexchange",
  storageBucket: "textbookexchange.appspot.com",
  messagingSenderId: "1073406907640"
};

firebase.initializeApp(auth_config);

export const authentication = firebase.auth();
export const storage = firebase.storage();

export const uploadPhotos = async (listingId, imageFiles) => {
  let storageRef = storage.ref();

  await Promise.all(imageFiles.map(file => {
    const imageRef = storageRef.child(listingId + '/' + file.name);
    return imageRef.put(file);
  }));

  return "success";
};

export const fetchPhotoUrls = async (listingId, imageNames) => {
  const photoUrls = [];
  let storageRef = storage.ref();

  await Promise.all(imageNames.map(name => {
    const imageRef = storageRef.child(listingId + '/' + name);
    return imageRef.getDownloadURL().then(photoUrls.push.bind(photoUrls));
  }));

  return photoUrls;
};

export const deleteListingPhotos = async (listingId, imageNames) => {
  let storageRef = storage.ref();

  await Promise.all(imageNames.map(name => {
    const imageRef = storageRef.child(listingId + '/' + name);
    return imageRef.delete();
  })).catch((error)=>{return error;});

  return "success";

};
