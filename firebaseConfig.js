import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
	apiKey: "AIzaSyD8JiomoGMeTtjvfWuVNz8Rxlow2eJk8SA",
	authDomain: "fir-chat-7495d.firebaseapp.com",
	projectId: "fir-chat-7495d",
	storageBucket: "fir-chat-7495d.appspot.com",
	messagingSenderId: "735645858557",
	appId: "1:735645858557:web:df77859425e071f35cdc94",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const userRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
