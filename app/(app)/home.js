import {
	ActivityIndicator,
	Button,
	StyleSheet,
	Text,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import { StatusBar } from "expo-status-bar";
import ChatList from "../../components/ChatList";
import Loading from "../../components/Loading";

import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getDocs, query, where } from "firebase/firestore";
import { userRef } from "../../firebaseConfig";

const home = () => {
	const { logout, user } = useAuth();
	const [users, setUsers] = useState([1, 2, 3]);

	useEffect(() => {
		if (user?.uid) {
			getUsers();
		}
	}, []);

	const getUsers = async () => {
		try {
			const q = query(userRef, where("userId", "!=", user.uid));

			const querySnapshot = await getDocs(q);
			const data = [];
			querySnapshot.forEach((doc) => {
				data.push(doc.data());
			});
			setUsers(data);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<StatusBar style="light" />
			{users.length > 0 ? (
				<ChatList users={users} />
			) : (
				<View className="flex items-center" style={{ top: hp(30) }}>
					<ActivityIndicator size="large" />
					{/* <Loading size={hp(7)} /> */}
				</View>
			)}
		</View>
	);
};

export default home;

const styles = StyleSheet.create({});
