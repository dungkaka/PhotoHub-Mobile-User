import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import request from "../../../utils/axios";
import { URL } from "../../../configs/end-points-url";
import { useNavigation } from "@react-navigation/native";
import { color } from "../../../utils/f";
const window = Dimensions.get("window");
import { MaterialCommunityIcons } from "@expo/vector-icons";
import customAlert from "../../Common/CustomAlert";
import Spinner from "react-native-loading-spinner-overlay";
const avatar_1 =
  "https://firebasestorage.googleapis.com/v0/b/photohub-e7e04.appspot.com/o/avatar%2Favatar_1.jpg?alt=media&token=3efbdede-a9ca-4bd6-95f3-9cd9383e6379";

const ChatActive = () => {
  const navigation = useNavigation();
  const [listActiveChat, setListActiveChat] = useState([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    getListActiveChat();
  }, []);

  const getListActiveChat = async () => {
    try {
      setFetching(true);
      const response = await request.server.get(URL.GET_LIST_ACTIVE_CHAT());
      const data = response.data;

      if (data.status == true) {
        setListActiveChat(data.chatRooms);
        setFetching(false);
      } else throw Error(data.message);
    } catch (error) {
      setFetching(false);
      console.log(error.message);
    }
  };

  const deactivateChat = async (item) => {
    console.log("CHATROOM", item);
    try {
      setFetching(true);
      const response = await request.server.put(
        URL.DEACTIVATE_CHATROOM(item.id)
      );
      const data = response.data;

      if (data.status == true) {
        setListActiveChat(listActiveChat.filter((chat) => chat.id != item.id));
        setFetching(false);
      } else throw Error(data.message);
    } catch (error) {
      setFetching(false);
      console.log(error.message);
    }
  };

  const renderChatItem = (item) => {
    const { name } = item.photographer;
    return (
      <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
        <TouchableOpacity
          style={styles.chatItem}
          onPress={() => {
            navigation.push("Chat", {
              room_id: item.id,
              photographer: {
                ...item.photographer,
              },
              fromChat: true,
            });
          }}
        >
          {/* Image and detail of photogeapher */}
          <View style={styles.result}>
            <Image
              style={styles.image}
              source={{
                uri: avatar_1,
              }}
            />

            <View style={styles.contentResult}>
              <Text
                style={{ fontWeight: "bold", fontSize: 20, color: "white" }}
              >
                {name}
              </Text>
              <Text
                style={{
                  color: color.gray8,
                  fontStyle: "italic",
                  color: "white",
                }}
              >
                Photography
              </Text>
            </View>

            <View style={styles.deactiveChat}>
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    customAlert(
                      "Are you sure to deactive this connect !",
                      () => {
                        deactivateChat(item);
                      },
                      () => {}
                    );
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={24}
                    color="white"
                  ></MaterialCommunityIcons>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("./../../../assets/images/background-1.jpg")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      <Spinner
        visible={fetching}
        textStyle={{ color: "black" }}
        cancelable={true}
        animation="fade"
      />
      <FlatList
        style={{ marginHorizontal: 10, marginTop: 80 }}
        keyExtractor={(item) => item.id}
        data={listActiveChat}
        renderItem={({ item }) => renderChatItem(item)}
      />
    </ImageBackground>
  );
};

export default ChatActive;

const styles = StyleSheet.create({
  chatItem: {
    borderRadius: 20,
    backgroundColor: "rgba(200,200,200,0.12)",
    flexDirection: "row",
  },
  result: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: "row",
  },
  image: {
    borderRadius: 200,
    height: window.width / 7,
    width: window.width / 7,
  },
  contentResult: {
    paddingStart: 15,
  },
  bottomResult: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  deactiveChat: {
    flex: 1,
    flexDirection: "row",
  },
});
