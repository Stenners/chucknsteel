import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
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

const db = getFirestore(app);

interface User {
  name: string;
  program: string;
}

interface Program {
  name: string;
  day: number;
  workouts: Array<Exercise>;
}

interface Exercise {
  name: string;
  current: number;
  prog_index: number;
}

export interface UserData {
  user: User;
  program: Program;
  tier1: object;
  tier2: object;
  tier3: object;
}

export const googleAuth = async () => {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  } catch (error) {
    console.log("googleAuth", error);
  }
};

export const logout = async () => {
  return await signOut();
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

const getProgram = async (programId: string, userId: string) => {
  const programRef = doc(db, "programs", programId);
  const programSnap = await getDoc(programRef);
  const workouts: Array<string> = [];
  if (programSnap.exists()) {
    const programData = programSnap.data() as Program;
    const workoutsSnap = await getDocs(
      collection(db, `programs/${programId}/workouts`)
    );
    workoutsSnap.forEach((workout) => {
      const exercises = workout.data().exercises;
      const eArr: Array<Exercise> = [];
      exercises.forEach(async (exercise: string) => {
        // const e1Arr: Array<string> = [];
        const exerciseRef = doc(db, "exercises", exercise);
        const exerciseSnap = await getDoc(exerciseRef);
        const exerciseData = exerciseSnap.data();
        const exerciseID = exerciseSnap.id;
        let obj: Exercise = {
          name: exerciseData.name,
          id: exerciseID,
        }
        eArr.push(obj);
      });
      workouts.push(eArr);
    });
    programData.workouts = workouts;
    return programData;
  }
};

export const userDoc = async (userId: string) => {
  if (userId) {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = {} as UserData;
    if (userSnap.exists()) {
      const userRes = userSnap.data() as User;
      userData.user = userRes;
      const programId = userRes.program;
      if (programId) {
        const program = await getProgram(programId);
        console.log("program =", program);
        userData.program = program;
        const userProgramRef = doc(
          db,
          `users/${userId}/program_data/`,
          programId
        );
        const userProgramSnap = await getDoc(userProgramRef);
        const userProgramData = userProgramSnap.data();
        userData.program.day = userProgramData.day;
        userData.tier1 = userProgramData.tier1;
        userData.tier2 = userProgramData.tier2;
        userData.tier3 = userProgramData.tier3;
      }
      return userData;
    } else {
      console.log("No program");
    }
  } else {
    console.log("No such document!");
    return false;
  }
};

export const auth = getAuth();
