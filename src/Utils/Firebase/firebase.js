import * as firebase from 'firebase';
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
  for (let i = 0; i < imageFiles.length; i++) {
    let imageFile = imageFiles[i];
    let imgref = storageRef.child(listingId + '/' + imageFile.name);
    await imgref.put(imageFile).then((snapshot)=>{
      console.log('Uploaded a blob or file!');
    }).catch((error)=>{return error;});
  }
  return "success";
};

export const fetchPhotoUrls = async (listingId, imageNames) => {
  var photoUrls = [];
  let storageRef = storage.ref();
  for (let i = 0 ; i < imageNames.length; i++) {
    let imageRef = storageRef.child(listingId + '/' + imageNames[i]);
    try { photoUrls.push(await imageRef.getDownloadURL()); }
    catch(err) {return err}
  }
  return photoUrls;
};

export const deleteListingPhotos = (listingId) => {

};
