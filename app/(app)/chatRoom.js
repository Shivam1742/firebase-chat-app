import {
	View,
	TextInput,
	TouchableOpacity,
	Alert,
	Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome } from "@expo/vector-icons";

import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessageList from "../../components/MessageList";
import CustomKeyboardView from "../../components/CustomKeyboardView";
import {
	Timestamp,
	addDoc,
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	setDoc,
} from "firebase/firestore";
import { getRoomId } from "../../utils/common";
import { useAuth } from "../../context/authContext";
import { db } from "../../firebaseConfig";
const ChatRoom = () => {
	const item = useLocalSearchParams();
	const { user } = useAuth();
	const router = useRouter();
	const [messages, setMessages] = useState([]);
	const textRef = useRef();
	const inputRef = useRef();
	const scrollViewRef = useRef();

	useEffect(() => {
		createRoomIfNotExists();
		const roomId = getRoomId(user?.userId, item?.userId);
		const docRef = doc(db, "rooms", roomId);
		const messagesRef = collection(docRef, "messages");
		const q = query(messagesRef, orderBy("createdAt", "asc"));
		let unsub = onSnapshot(q, (snapshot) => {
			let allMessages = snapshot.docs.map((doc) => {
				return doc.data();
			});
			setMessages([...allMessages]);
		});
		const KeyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			updateScrollView
		);
		return () => {
			unsub();
			KeyboardDidShowListener.remove();
		};
	}, []);

	const createRoomIfNotExists = async () => {
		const roomId = getRoomId(user?.userId, item?.userId);
		await setDoc(doc(db, "rooms", roomId), {
			roomId,
			createdAt: Timestamp.fromDate(new Date()),
		});
	};

	useEffect(() => {
		updateScrollView();
	}, [messages]);

	const updateScrollView = () => {
		setTimeout(() => {
			scrollViewRef?.current?.scrollToEnd({ animated: true });
		}, 100);
	};

	const handleSendMessage = async () => {
		let message = textRef.current.trim();
		if (!message) return;
		try {
			const roomId = getRoomId(user?.userId, item?.userId);
			const docRef = doc(db, "rooms", roomId);
			const messagesRef = collection(docRef, "messages");
			textRef.current = "";

			if (inputRef) inputRef?.current?.clear();

			const newDoc = await addDoc(messagesRef, {
				userId: user?.userId,
				text: message,
				profileUrl: user?.profileUrl,
				senderName: user?.username,
				createdAt: Timestamp.fromDate(new Date()),
			});
		} catch (error) {
			Alert.alert("Message", error.message);
		}
	};

	return (
		<CustomKeyboardView inChat={true}>
			<View className="flex-1 bg-white">
				<StatusBar style="dark" />
				<ChatRoomHeader user={item} router={router} />
				<View className="h-2 border-b border-b-neutral-300" />
				<View className="flex-1 justify-between bg-neutral-100 overflow-visible">
					<View className="flex-1">
						<MessageList
							scrollViewRef={scrollViewRef}
							messages={messages}
							currentUser={user}
						/>
					</View>
					<View style={{ marginBottom: hp(2.7) }} className="pt-2">
						<View className="flex-row justify-between mx-3 bg-white border p-2 border-neutral-300 rounded-full pl-5">
							<TextInput
								ref={inputRef}
								placeholder="Type message..."
								className="flex-1 mr-2"
								style={{ fontSize: hp(2) }}
								onChangeText={(value) =>
									(textRef.current = value)
								}
							/>

							<TouchableOpacity
								onPress={handleSendMessage}
								className="bg-neutral-200 p-2 mr-[1px] rounded-full"
							>
								<FontAwesome
									name="send-o"
									size={hp(2.8)}
									color="#737373"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</CustomKeyboardView>
	);
};

export default ChatRoom;
