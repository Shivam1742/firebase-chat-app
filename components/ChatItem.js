import { Image } from "expo-image";
import { View, Text, TouchableOpacity } from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { blurhash, formatDate, getRoomId } from "../utils/common";
import { useEffect, useState } from "react";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";

const ChatItem = ({ item, index, noBorder, router }) => {
	const [lastMessages, setLastMessages] = useState(undefined);
	const { user } = useAuth();
	useEffect(() => {
		const roomId = getRoomId(user?.userId, item?.userId);
		const docRef = doc(db, "rooms", roomId);
		const messagesRef = collection(docRef, "messages");
		const q = query(messagesRef, orderBy("createdAt", "desc"));
		let unsub = onSnapshot(q, (snapshot) => {
			let allMessages = snapshot.docs.map((doc) => {
				return doc.data();
			});
			setLastMessages(() => (allMessages[0] ? allMessages[0] : null));
		});
		return unsub;
	}, []);

	// console.log("last messages: ", lastMessages);

	const handleChatRoom = () => {
		router.push({ pathname: "/chatRoom", params: item });
	};

	const renderTime = () => {
		let date = lastMessages?.createdAt;
		if (date) {
			return formatDate(new Date(date?.seconds * 1000));
		}
	};
	const renderLastMessage = () => {
		if (typeof lastMessages === "undefined") return "Loading...";
		if (lastMessages) {
			if (user?.userId === lastMessages?.userId) {
				return "You: " + lastMessages?.text;
			}
			return lastMessages?.text;
		} else {
			return "Say Hi 🖐️";
		}
	};

	return (
		<TouchableOpacity
			onPress={handleChatRoom}
			className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-4 ${
				!noBorder ? "border-b border-b-neutral-200" : null
			} `}
		>
			<Image
				source={item?.profileUrl}
				style={{
					height: hp(6),
					width: hp(6),
					borderRadius: 100,
				}}
				className="rounded-full"
				placeholder={blurhash}
				transition={500}
			/>
			<View className="flex-1 gap-1">
				<View className="flex-row justify-between">
					<Text
						style={{ fontSize: hp(1.8) }}
						className="font-semibold text-neutral-800"
					>
						{item?.username}
					</Text>
					<Text
						style={{ fontSize: hp(1.6) }}
						className="font-medium text-neutral-500"
					>
						{renderTime()}
					</Text>
				</View>
				<Text
					style={{ fontSize: hp(1.6) }}
					className="font-medium text-neutral-500"
				>
					{renderLastMessage()}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export default ChatItem;
