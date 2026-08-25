import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVOVxytKvuAnbVx2w6djW4TU5yi6KOWCw",
  authDomain: "astu-msj-bootcamp-89a67.firebaseapp.com",
  projectId: "astu-msj-bootcamp-89a67",
  storageBucket: "astu-msj-bootcamp-89a67.firebasestorage.app",
  messagingSenderId: "877754431247",
  appId: "1:877754431247:web:b1acbb1928d095a8f4707a",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const SETTINGS_DOC = doc(db, "system_settings", "registration");

export const updateRegistrationStatus = async (type, isOpen) => {
  try {
    await setDoc(SETTINGS_DOC, { [type]: isOpen }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating status:", error);
    return false;
  }
};

export const subscribeToRegistrationStatus = (callback) => {
  return onSnapshot(
    SETTINGS_DOC,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback({ isStudentRegOpen: true, isMentorRegOpen: true });
      }
    },
    (error) => {
      console.error("Error subscribing:", error);
      callback({ isStudentRegOpen: true, isMentorRegOpen: true });
    },
  );
};
