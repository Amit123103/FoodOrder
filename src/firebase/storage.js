import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './config';

// Upload image to Firebase Storage
export async function uploadImage(file, path = 'foods') {
  const timestamp = Date.now();
  const fileName = `${path}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, fileName);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload progress: ${progress}%`);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// Delete image from Firebase Storage
export async function deleteImage(imageUrl) {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}
