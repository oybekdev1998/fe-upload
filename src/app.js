import firebase from "firebase/compat/app";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";

import {upload} from "./upload";
import './style.css';


const firebaseConfig = {
  apiKey: "AIzaSyDhOGj2B2GZjCdbnLCkfeKt_I_SV1rvEeY",
  authDomain: "fe-upload-e522a.firebaseapp.com",
  projectId: "fe-upload-e522a",
  storageBucket: "fe-upload-e522a.appspot.com",
  messagingSenderId: "522855194590",
  appId: "1:522855194590:web:a1bddd41d5c8bc1bdb874f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
console.log(app)
const storage = getStorage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpg', '.jpeg', '.svg'],
  onUpload(files, blocks) {
    files.forEach((file, index) => {
      const imagesRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(imagesRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
          const block = blocks[index].querySelector('.preview-info-progress')
          block.textContent = progress + '%'
          block.style.width = progress + '%'


          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':

              break;
            case 'storage/canceled':
              break;

            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
          });
        }
      );

    })
  }
})