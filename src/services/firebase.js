import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

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

// ================= REGISTRATION WINDOW SYNC =================
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

// ================= PROFILE EDIT REQUESTS =================

// 1. ጥያቄ መላክ (Student / Mentor Request)
export const sendProfileEditRequest = async (requestData) => {
  try {
    await addDoc(collection(db, "profile_edit_requests"), {
      ...requestData,
      status: "Pending",
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending edit request:", error);
    return { success: false, error: error.message };
  }
};

// 2. ጥያቄዎችን በቅጽበት ለአድሚን ማዳመጥ (Admin Listener)
export const subscribeToEditRequests = (callback) => {
  const q = query(
    collection(db, "profile_edit_requests"),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const requests = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(requests);
    },
    (error) => {
      console.error("Error subscribing to edit requests:", error);
      callback([]);
    },
  );
};

// 3. የጥያቄውን ሁኔታ መቀየር (Admin Approve / Reject)
export const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const reqDoc = doc(db, "profile_edit_requests", requestId);
    await updateDoc(reqDoc, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating request status:", error);
    return false;
  }
};
