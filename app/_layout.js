import { Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";

const MainLayout = () => {
	const { isAuthenticated } = useAuth();
	const segment = useSegments();
	const router = useRouter();

	useEffect(() => {
		if (typeof isAuthenticated === "undefined") return;

		const inApp = segment[0] === "(app)";

		if (isAuthenticated && !inApp) {
			router.replace("home");
		} else if (isAuthenticated === false) {
			router.replace("signIn");
		}
	}, [isAuthenticated]);

	return <Slot />;
};

const RootLayout = () => {
	return (
		<MenuProvider>
			<AuthContextProvider>
				<MainLayout />
			</AuthContextProvider>
		</MenuProvider>
	);
};
export default RootLayout;
