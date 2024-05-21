import { View, Text, Platform } from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/common";
import { useAuth } from "../context/authContext";

import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
} from "react-native-popup-menu";
import { MenuItem } from "./CustomMenuItem";
import { AntDesign, Feather } from "@expo/vector-icons";

const ios = Platform.OS === "ios";

const HomeHeader = () => {
	const { top } = useSafeAreaInsets();
	const { user, logout } = useAuth();

	const handleProfile = () => {};
	const handleLogout = async () => {
		await logout();
	};

	return (
		<View
			style={{ paddingTop: ios ? top : top + 10 }}
			className="flex-row justify-between px-5 bg-indigo-400 pb-6 rounded-b-3xl shadow"
		>
			<View>
				<Text
					style={{ fontSize: hp(3) }}
					className="text-white font-medium"
				>
					Chats
				</Text>
			</View>
			<View>
				<Menu>
					<MenuTrigger>
						<Image
							style={{
								height: hp(4.3),
								aspectRatio: 1,
								borderRadius: 100,
							}}
							source={{
								uri: user.profileUrl,
							}}
							placeholder={blurhash}
							transition={1000}
						/>
					</MenuTrigger>
					<MenuOptions
						customStyles={{
							optionsContainer: {
								borderRadius: 10,
								borderCurve: "continuous",
								marginTop: 30,
								marginLeft: -20,
								backgroundColor: "white",
								shadowOpacity: 0.2,
								shadowOffset: { width: 0, height: 0 },
								elevation: 0.4,
								width: 160,
							},
						}}
					>
						<MenuItem
							text="Profile"
							action={handleProfile}
							value={null}
							icon={
								<Feather
									name="user"
									size={hp(2.5)}
									color="#737373"
								/>
							}
						/>
						<Divider />
						<MenuItem
							text="Sign Out"
							action={handleLogout}
							value={null}
							icon={
								<AntDesign
									name="logout"
									size={hp(2.5)}
									color="#737373"
								/>
							}
						/>
					</MenuOptions>
				</Menu>
			</View>
		</View>
	);
};

const Divider = () => {
	return <View className="p-[0.4px] bg-neutral-200" />;
};
export default HomeHeader;
