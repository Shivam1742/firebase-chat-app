import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
	View,
	Text,
	Image,
	TextInput,
	Pressable,
	TouchableOpacity,
	Alert,
} from "react-native";
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Loading from "../components/Loading";
import CustomKeyboardView from "../components/CustomKeyboardView";
import { useAuth } from "../context/authContext";

const SignIn = () => {
	const router = useRouter();
	const { login } = useAuth();
	const [loading, setLoading] = useState(false);

	const emailRef = useRef();
	const passwordRef = useRef();

	const handleLogin = async () => {
		if (!emailRef.current || !passwordRef.current) {
			Alert.alert("Sign In", "Please fill all the fields");
			return;
		}
		setLoading(true);
		const response = await login(emailRef.current, passwordRef.current);
		setLoading(false);
		if (!response.success) {
			Alert.alert("Sign In", response.msg);
		}
	};

	return (
		<CustomKeyboardView>
			<StatusBar style="dark" />
			<View
				style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
				className="flex-1 gap-12"
			>
				<View className="items-center">
					<Image
						source={require("../assets/images/login.png")}
						style={{ height: hp(25) }}
						resizeMode="contain"
					/>
				</View>
				<View className="gap-10">
					<Text
						style={{ fontSize: hp(4) }}
						className="font-bold tracking-wider text-center text-neutral-800"
					>
						Sign In
					</Text>

					<View className="gap-4">
						<View
							style={{ height: hp(7) }}
							className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
						>
							<Octicons name="mail" size={hp(2.7)} color="gray" />
							<TextInput
								onChangeText={(value) =>
									(emailRef.current = value)
								}
								style={{ fontSize: hp(2) }}
								className="flex-1 font-semibold text-neutral-700"
								placeholder="Email Address"
								placeholderTextColor="gray"
								keyboardType="email-address"
							/>
						</View>
						<View className="gap-3">
							<View
								style={{ height: hp(7) }}
								className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
							>
								<Octicons
									name="lock"
									size={hp(2.7)}
									color="gray"
								/>
								<TextInput
									onChangeText={(value) =>
										(passwordRef.current = value)
									}
									style={{ fontSize: hp(2) }}
									className="flex-1 font-semibold text-neutral-700"
									placeholder="Password"
									placeholderTextColor="gray"
									secureTextEntry
								/>
							</View>
							<Text
								style={{ fontSize: hp(1.8) }}
								className="font-semibold text-right text-neutral-500"
							>
								Forgot Password?
							</Text>
						</View>
						<View>
							{loading ? (
								<View className="flex-row justify-center">
									<Loading size={hp(6.5)} />
								</View>
							) : (
								<TouchableOpacity
									onPress={handleLogin}
									style={{ height: hp(6.5) }}
									className="bg-indigo-500 rounded-xl justify-center items-center"
								>
									<Text
										style={{ fontSize: hp(2.7) }}
										className="text-white font-bold tracking-wider"
									>
										Sign In
									</Text>
								</TouchableOpacity>
							)}
						</View>

						<View className="flex-row justify-center">
							<Text
								style={{ fontSize: hp(1.8) }}
								className="font-semibold text-neutral-500"
							>
								Don't have an account?
							</Text>
							<Pressable onPress={() => router.push("signUp")}>
								<Text
									style={{ fontSize: hp(1.8) }}
									className="font-bold text-indigo-500"
								>
									Sign Up
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</View>
		</CustomKeyboardView>
	);
};

export default SignIn;
