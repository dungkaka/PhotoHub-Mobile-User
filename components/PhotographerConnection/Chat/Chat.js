import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  AppState,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector } from "react-redux";
import { firestoreRef } from "../../../configs/firebase-config";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import {
  GiftedChat,
  Avatar,
  utils,
  Bubble,
  InputToolbar,
  Actions,
  Send,
  Message,
  MessageText,
} from "react-native-gifted-chat";
import CustomLinearGradient from "./../../Common/LinearGradient/index";
import { color } from "../../../utils/f";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Facebook } from "react-content-loader/native";
import customAlert from "./../../Common/CustomAlert/index";
import { random_rainbowGradient } from "../../../utils/gradient";
import { LinearGradient } from "expo-linear-gradient";
import { Notifications } from "expo";

const { isSameUser, isSameDay } = utils;

const chatRef = firestoreRef.collection("chat");
const userRef = firestoreRef.collection("users");

const avatar_1 =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/avatar%2Favatar_1.jpg?alt=media&token=3efbdede-a9ca-4bd6-95f3-9cd9383e6379";
const avatar_2 =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/avatar%2Favatar_2.jpg?alt=media&token=f35731bb-90d0-4a6c-83e6-2192a2742f43";

console.disableYellowBox = true;

const Chat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useSelector((store) => store.user.user);
  const {
    photographer,
    location,
    distance,
    fromMap,
    fromChat,
    room_id,
  } = route.params ? route.params : {};
  const { name, age, gender, address } = photographer;
  const [randomGradient, setRandomGradent] = useState(random_rainbowGradient());

  useEffect(() => {
    userRef
      .doc(photographer.id)
      .get()
      .then((snapshot) => {
        navigation.setParams({
          photographer: { ...snapshot.data(), id: snapshot.id },
        });
      });
    AppState.addEventListener("change", handleAppStateChange);
    Notifications.deleteChannelAndroidAsync("chatapplication");

    return () => {
      AppState.removeEventListener("change", handleAppStateChange);
      Notifications.createChannelAndroidAsync("chatapplication", {
        name: "PhotoHub",
        title: "Message",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (AppState.currentState == "active") {
      console.log("ACTIVE");
      Notifications.deleteChannelAndroidAsync("chatapplication");
    } else {
      console.log("BACKGROUND / INACTIVE");
      Notifications.createChannelAndroidAsync("chatapplication", {
        name: "PhotoHub",
        title: "Message",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.backgroundAndroid }}>
      <LinearGradient colors={randomGradient} start={[0, 0]} end={[1, 1]}>
        <View style={styles.result}>
          {/* Image and detail of photogeapher */}
          <View style={styles.topResult}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 6,
                marginRight: 5,
                alignContent: "center",
              }}
            >
              <AntDesign name="arrowleft" size={24} color="white"></AntDesign>
            </TouchableOpacity>
            <Image
              style={styles.image}
              source={{
                uri: avatar_1,
              }}
            ></Image>

            <View style={styles.contentResult}>
              <Text
                style={{ fontWeight: "bold", fontSize: 18, color: "white" }}
              >
                {name}
              </Text>
            </View>
          </View>

          {/* Distane and go to connect */}
          <View style={styles.bottomResult}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", letterSpacing: 1 }}>
                Infomation:
              </Text>
              {gender ? (
                <Text
                  style={{
                    color: "white",
                    letterSpacing: 1,
                    fontStyle: "italic",
                  }}
                >
                  {gender} - {age}
                </Text>
              ) : (
                <Text
                  style={{
                    color: "white",
                    letterSpacing: 1,
                    fontStyle: "italic",
                  }}
                >
                  I'm photographer
                </Text>
              )}
            </View>
            <View style={styles.distance}>
              <Text
                style={[styles.numberDistance, { color: randomGradient[0] }]}
              >
                {(1000 * distance).toFixed(0)}
              </Text>
              <Text style={[styles.unit, { color: randomGradient[0] }]}>
                {" "}
                metter{" "}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {photographer.username ? (
        <ChatScreen
          user={user}
          photographer={photographer}
          location={location}
          randomGradient={randomGradient}
          fromMap={fromMap}
          fromChat={fromChat}
          room_id={room_id}
        />
      ) : null}
    </View>
  );
};

const ChatScreen = ({
  user,
  photographer,
  randomGradient,
  fromMap,
  fromChat,
  room_id,
}) => {
  const roomChat = useRef();
  const [fetchingRoom, setFetchingRoom] = useState(false);
  const [messages, setMessages] = useState([]);
  const [active, setActive] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    let unsubcribeChatRoom = () => {};

    const accessRoomchat = async () => {
      setFetchingRoom(true);
      try {
        if (photographer && user) {
          // Check where exist room chat containing user and photographer
          let chatRoomSnapshot = null;
          if (fromChat) {
            console.log("ID", room_id);
            chatRoomSnapshot = await chatRef.doc(room_id).get();
            chatRoomSnapshot = {
              docs: [chatRoomSnapshot],
            };
          } else {
            chatRoomSnapshot = await chatRef
              .where("user.id", "==", user.id)
              .where("photographer.id", "==", photographer.id)
              .where("active", "==", true)
              .get();
          }

          // If no chatRoom exist, create New, and add chat room ref. Elsem just get room chat ref
          if (chatRoomSnapshot.empty) {
            chatRef
              .add({
                createdAt: new Date(),
                active: true,
                user: {
                  id: user.id,
                  name: user.name ? user.name : user.username,
                },
                photographer: {
                  id: photographer.id,
                  name: photographer.name
                    ? photographer.name
                    : photographer.username,
                },
              })
              .then((docRef) => {
                roomChat.current = docRef;
                setActive(true);
                setFetchingRoom(false);
                unsubcribeChatRoom = roomChat.current
                  .collection("messages")
                  .onSnapshot((snapshot) => {
                    snapshot.docChanges().forEach((change) => {
                      const newMessage = {
                        ...change.doc.data(),
                        createdAt: change.doc.data().createdAt.toDate(),
                      };
                      setMessages((preMessage) =>
                        GiftedChat.append(preMessage, newMessage)
                      );
                    });
                  });
              });
          } else {
            // Check if the room active or inactive. If active, realtime listen, if inactive, just fetching data.
            const active = chatRoomSnapshot.docs[0].data().active;
            console.log("ROOM", chatRoomSnapshot.docs[0].data());
            roomChat.current = chatRoomSnapshot.docs[0].ref;
            if (active) {
              setActive(true);
              setFetchingRoom(false);
              unsubcribeChatRoom = roomChat.current
                .collection("messages")
                .orderBy("createdAt", "desc")
                .onSnapshot((snapshot) => {
                  const newMessages = [];
                  for (let change of snapshot.docChanges()) {
                    newMessages.push({
                      ...change.doc.data(),
                      createdAt: change.doc.data().createdAt.toDate(),
                    });
                  }
                  setMessages((preMessages) =>
                    GiftedChat.append(preMessages, newMessages)
                  );
                });
            } else {
              if (fromMap) {
                chatRef
                  .add({
                    createdAt: new Date(),
                    active: true,
                    user: {
                      id: user.id,
                      name: user.name ? user.name : user.username,
                    },
                    photographer: {
                      id: photographer.id,
                      name: photographer.name
                        ? photographer.name
                        : photographer.username,
                    },
                  })
                  .then((docRef) => {
                    roomChat.current = docRef;
                    setActive(true);
                    setFetchingRoom(false);
                    unsubcribeChatRoom = roomChat.current
                      .collection("messages")
                      .onSnapshot((snapshot) => {
                        snapshot.docChanges().forEach((change) => {
                          const newMessage = {
                            ...change.doc.data(),
                            createdAt: change.doc.data().createdAt.toDate(),
                          };
                          setMessages((preMessage) =>
                            GiftedChat.append(preMessage, newMessage)
                          );
                        });
                      });
                  });
              } else {
                console.log("HIHIHI");
                roomChat.current
                  .collection("messages")
                  .orderBy("createdAt", "desc")
                  .get()
                  .then((snapshot) => {
                    const messages = [];
                    for (let doc of snapshot.docs) {
                      messages.push({
                        ...doc.data(),
                        createdAt: doc.data().createdAt.toDate(),
                      });
                    }
                    setMessages((preMessages) =>
                      GiftedChat.append(preMessages, messages)
                    );
                  });
              }
            }
          }
        }
      } catch (error) {
        console.log("ERROR", error.message);
        setError(error.message);
        setFetchingRoom(false);
      }
    };
    accessRoomchat();
    return () => {
      unsubcribeChatRoom();
    };
  }, [photographer]);

  const onSend = async (message = []) => {
    try {
      await roomChat.current.collection("messages").add(message[0]);
      const messagePush = {
        to: photographer.tokenPushNotification,
        sound: "default",
        title: "Message",
        body: (user.name ? user.name : user.username) + ": " + message[0].text,
        data: { data: "goes here 1" },
        _displayInForeground: false,
        channelId: "chatapplication",
      };
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePush),
      });
    } catch (error) {}
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.id,
          name: user.name ? user.name : user.username,
          avatar: user.gender == "male" ? avatar_1 : avatar_2,
        }}
        renderTime={() => null}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: "transparent",
                overflow: "hidden",
                margin: 1,
              },
              left: {
                backgroundColor: color.gray2,
                overflow: "hidden",
                margin: 1,
              },
            }}
          />
        )}
        disableComposer={!active}
        renderMessage={(props) => <Message {...props} />}
        renderMessageText={(props) => (
          <LinearGradient colors={randomGradient} start={[0, 0]} end={[1, 1]}>
            <MessageText
              {...props}
              containerStyle={{
                right: {
                  margin: 0,
                  padding: 3,
                },
                left: {
                  margin: 0,
                  padding: 3,
                  backgroundColor: color.gray2,
                },
              }}
            />
          </LinearGradient>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              flex: 1,
              backgroundColor: "white",
              borderTopColor: "transparent",
              borderTopWidth: 0,
              padding: 3,
            }}
          />
        )}
        renderActions={(props) => (
          <Actions
            {...props}
            style={{
              borderRadius: 10,
              backgroundColor: color.blueModern1,
            }}
            onPressActionButton={() =>
              customAlert("Function have not implement yet!")
            }
          />
        )}
        renderSend={(props) => (
          <Send
            {...props}
            containerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: color.blueModern1,
                borderRadius: 25,
                marginHorizontal: 10,
                paddingHorizontal: 15,
                paddingVertical: 5,
              }}
            >
              <Ionicons name="md-send" color="white" size={20} />
            </View>
          </Send>
        )}
        renderLoading={() => <Facebook />}
      />
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  result: {
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight + 5,
    paddingBottom: 10,
    flexDirection: "column",
  },
  image: {
    borderRadius: 200,
    height: 35,
    width: 35,
  },
  contentResult: {
    paddingStart: 15,
    flex: 2,
  },
  topResult: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottomResult: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  distance: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 5,
  },
  numberDistance: {
    fontSize: 30,
    fontWeight: "bold",
    includeFontPadding: false,
    bottom: -3,
  },
  unit: {
    color: "white",
    textAlignVertical: "bottom",
  },
});
