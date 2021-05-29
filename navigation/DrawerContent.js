import React from "react";
import { DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Text, TouchableOpacity } from "react-native";
import { Image, View, Alert, BackHandler } from "react-native";
import styles from "./index.style";
import { MaterialCommunityIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

const background = require("./../assets/images/logo-back.png");

const Header = (props) => {
  const navigation = props.rootNavigation;
  const { user } = useSelector((store) => store.user);

  if (user == null) {
    return (
      <View style={{ marginStart: 20, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "column",
            maxHeight: 60,
            marginBottom: 10,
          }}
        >
          <Image source={background} style={{ maxWidth: "100%", maxHeight: "100%" }} resizeMode="center" />
        </View>

        <Text
          style={{
            fontSize: 14,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          hdbluetc@gmail.com
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              backgroundColor: "lightgray",
              paddingVertical: 5,
              paddingHorizontal: 20,
              marginTop: 10,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
              borderRadius: 15,
              borderWidth: 1,
              borderColor: "white",
            }}
            onPress={() => {
              // props.navigation.closeDrawer();
              navigation.navigate("Auth");
            }}
          >
            <AntDesign name="login" color="white" size={20} style={{ marginRight: 5 }} />
            <Text style={{ color: "white" }}> LOGIN </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ marginStart: 20, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: "column",
            maxHeight: 60,
            marginBottom: 10,
          }}
        >
          <Image source={background} style={{ maxWidth: "100%", maxHeight: "100%" }} resizeMode="center" />
        </View>
        <Text
          style={{
            fontSize: 16,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          {user.name ? user.name : user.username}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "white",
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          {user.email}
        </Text>
      </View>
    );
  }
};

const DrawerContent = (props) => {
  const navigation = props.navigation;
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  return (
    <DrawerContentScrollView {...props} scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          marginVertical: 40,
        }}
      >
        <View
          styles={{
            flex: 10,
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Header {...props}></Header>

          <DrawerItem
            label="PhotoHub"
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
            icon={() => (
              <MaterialCommunityIcons name="image-search" color="white" size={20} style={{ marginRight: -16 }} />
            )}
            onPress={() => navigation.jumpTo("PhotoHub")}
          />

          {user && (
            <DrawerItem
              label="Collection"
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
              icon={() => (
                <MaterialCommunityIcons name="image-album" color="white" size={20} style={{ marginRight: -16 }} />
              )}
              onPress={() => navigation.jumpTo("Collection")}
            />
          )}

          {true && (
            <DrawerItem
              label="Booking"
              labelStyle={styles.drawerLabel}
              style={styles.drawerItem}
              icon={() => <FontAwesome5 name="map-marked-alt" color="white" size={20} style={{ marginRight: -16 }} />}
              onPress={() => navigation.jumpTo("PhotographerConnection")}
            />
          )}

          <DrawerItem
            label="QR Scanner"
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
            icon={() => <AntDesign name="qrcode" color="white" size={20} style={{ marginRight: -16 }} />}
            onPress={() => navigation.jumpTo("QRCode")}
          />

          {/* <DrawerItem
            label="About"
            labelStyle={styles.drawerLabel}
            style={styles.drawerItem}
            icon={() => (
              <MaterialCommunityIcons
                name="information-variant"
                color="white"
                size={20}
                style={{ marginRight: -16 }}
              />
            )}
            onPress={() => navigation.jumpTo("About")}
          /> */}
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          {user && (
            <DrawerItem
              label="Logout"
              style={{ paddingStart: 10 }}
              labelStyle={[styles.drawerLabel, { color: "white", marginBottom: 5 }]}
              icon={() => <AntDesign name="logout" color="white" size={20} style={{ marginRight: -16 }} />}
              onPress={() => {
                Alert.alert(
                  "Alert",
                  "Are you sure to logout !",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () => dispatch({ type: "LOGOUT" }),
                    },
                  ],

                  { cancelable: false }
                );
              }}
            />
          )}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerContent;
