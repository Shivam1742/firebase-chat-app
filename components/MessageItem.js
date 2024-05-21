import { View, Text } from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MessageItem = ({ message, currentUser }) => {
	if (currentUser?.userId === message?.userId) {
		return (
			<View className="flex-row justify-end mb-3 mr-3">
				<View style={{ width: wp(80) }}>
					<View className="flex self-end bg-white p-3 rounded-2xl border border-neutral-200">
						<Text style={{ fontSize: hp(1.9) }}>
							{message?.text}
						</Text>
					</View>
				</View>
			</View>
		);
	} else {
		return (
			<View style={{ width: wp(80) }} className=" mb-3 ml-3">
				<View>
					<View className="flex self-start p-3 rounded-2xl bg-indigo-100 border border-indigo-200">
						<Text style={{ fontSize: hp(1.9) }}>
							{message?.text}
						</Text>
					</View>
				</View>
			</View>
		);
	}
};

export default MessageItem;
