import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(undefined);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsAuthenticated(true);
				setUser(user);
				updateUserData(user.uid);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		});
		return unsub;
	}, []);

	const login = async (email, password) => {
		try {
			const response = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			return { success: true };
		} catch (error) {
			let msg = error.message;

			if (msg.includes("auth/invalid-email")) msg = "Invalid email";
			if (msg.includes("auth/invalid-credential"))
				msg = "Invalid credentials";

			return { success: false, msg };
		}
	};

	const updateUserData = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			setUser({
				...user,
				username: data.username,
				profileUrl: data.profileUrl,
				userId: data.userId,
			});
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
			return { success: true };
		} catch (error) {
			return { success: false, msg: error.message, error };
		}
	};

	const register = async (email, password, username, profileUrl) => {
		console.log("called");
		try {
			const response = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			await setDoc(doc(db, "users", response?.user?.uid), {
				username,
				profileUrl,
				userId: response?.user?.uid,
			});

			return { success: true, data: response?.user };
		} catch (error) {
			let msg = error.message;

			if (msg.includes("auth/invalid-email")) msg = "Invalid email";
			if (msg.includes("auth/email-already-in-use"))
				msg = "This email id is already in use.";

			return { success: false, msg };
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, login, logout, register }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("useAuth must be warpped inside AuthContextProvider");
	}

	return value;
};
