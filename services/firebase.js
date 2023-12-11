import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  getDoc,
  getDocs,
  doc,
  collection,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyrfP72sL_uDHCmXVfoqZulJzTt-nXnBQ",
  authDomain: "chuckingsteel-b98ad.firebaseapp.com",
  projectId: "chuckingsteel-b98ad",
  storageBucket: "chuckingsteel-b98ad.appspot.com",
  messagingSenderId: "1049343679809",
  appId: "1:1049343679809:web:4ed26c8582e35ca94715c0",
  measurementId: "G-YSPR438MTE",
};

const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// export const googleAuth = async () => {
//   try {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();
//     return await signInWithPopup(auth, provider);
//   } catch (error) {
//     console.log("googleAuth", error);
//   }
// };

export const emailAuth = async (email, password) => {
  try {
    const auth = getAuth();
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const checkAuth = async (callback) => {
  try {
    const auth = getAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("checkAuth", user.uid);
        callback(user.uid);
      } else {
        console.log("no user");
        callback(0);
      }
    });
  } catch (error) {
    console.log("checkAuth", error);
  }
};

export const userDoc = async (userId) => {
  if (userId) {
    try {
      const db = getFirestore(app);
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userData = {};
      if (userSnap.exists()) {
        const userRes = userSnap.data();
        userData.userInfo = userRes;
        const programId = userRes.program;
        if (programId) {
          const programRef = doc(db, "users", userId, "program_data", programId);
          const programSnap = await getDoc(programRef);
          if (programSnap.exists()) {
            const programData = programSnap.data();
            programData.t1 = [];
            programData.t2 = [];
            const t1Snapshot = await getDocs(
              collection(db, "users", userId, "program_data", programId, "tier1")
            );
            t1Snapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              const obj = {};
              obj[doc.id] = doc.data();
              programData.t1.push(obj);
            });
            userData.programInfo = programData;
          }
          return userData;
        } else {
          console.log("No program");
        }
      } else {
        console.log("No such document!");
        return false;
      }
    } catch (error) {
      console.error(error);
    }
  }
};
