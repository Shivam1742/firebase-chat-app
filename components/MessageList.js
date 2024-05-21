import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, scrollViewRef, currentUser }) => {
	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingTop: 10 }}
			ref={scrollViewRef}
		>
			{messages.map((message, index) => (
				<MessageItem
					message={message}
					key={index}
					currentUser={currentUser}
				/>
			))}
		</ScrollView>
	);
};

export default MessageList;
