import React, { useEffect, useState, useRef } from "react";
import { Text, View, Button, Vibration, Platform } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

const About = ({ navigation }) => {
  const [state, setState] = useState({
    expoPushToken: "",
    notification: {
      origin: null,
      data: {},
    },
  });

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      let token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      setState({ ...state, expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.addListener(_handleNotification);
  }, []);

  const _handleNotification = (notification) => {
    Vibration.vibrate();
    console.log("NOTIFI", notification);
    setState({
      ...state,
      notification: notification,
    });
  };

  const sendPushNotification = async () => {
    const message = {
      to: state.expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { data: "goes here 1" },
      _displayInForeground: true,
    };
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Origin: {state.notification.origin}</Text>
        <Text>Data: {JSON.stringify(state.notification.data)}</Text>
      </View>
      <Button
        title={"Press to Send Notification"}
        onPress={() => sendPushNotification()}
      />
    </View>
  );
};

export default About;

// const styles = StyleSheet.create({});
