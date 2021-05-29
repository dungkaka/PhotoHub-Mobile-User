import { Platform } from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";

export const registerForPushNotificationsAsync = async () => {
  let token = undefined;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync();
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
};

export const listenChatNotification = () => {
  if (Platform.OS === "android") {
    Notifications.createChannelAndroidAsync("chatapplication", {
      name: "PhotoHub",
      title: "Message",
      sound: true,
      priority: "max",
      vibrate: [0, 250, 250, 250],
    }).then((res) => console.log("NOTIII", res));
  }
};
