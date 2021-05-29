import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Animated from "react-native-reanimated";
import styles from "./index.style";
import MyCollection from "./MyCollection/index";
import CollectionDetail from "./CollectionDetail/CollectionDetail";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import ImageDetail from "./CollectionDetail/ImageDetail";
import { color } from "../../utils/f";
import CollectionQR from "./CollectionDetail/CollectionQR";

const Stack = createStackNavigator();

const Collection = ({ navigation, style }) => {
  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator
        headerMode="float"
        screenOptions={{
          headerStyle: {
            elevation: 0,
            backgroundColor: "#f2f2f2",
          },
          // cardStyle: { backgroundColor: "transparent" },
          // cardOverlayEnabled: true,
          // cardStyleInterpolator: ({ current: { progress } }) => ({
          //   // cardStyle: {
          //   //   opacity: progress.interpolate({
          //   //     inputRange: [0, 0.5, 0.9, 1],
          //   //     outputRange: [0, 0.25, 0.7, 1],
          //   //   }),
          //   // },
          //   // overlayStyle: {
          //   //   opacity: progress.interpolate({
          //   //     inputRange: [0, 1],
          //   //     outputRange: [0, 0.5],
          //   //     extrapolate: "clamp",
          //   //   }),
          //   // },
          // }),
        }}
        // mode="modal"
      >
        <Stack.Screen
          name="MyCollection"
          component={MyCollection}
          options={{
            headerLeft: ({ onPress }) => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{
                  marginLeft: 20,
                  alignContent: "center",
                }}
              >
                <AntDesign
                  name="menufold"
                  size={24}
                  color="#6486d3"
                ></AntDesign>
              </TouchableOpacity>
            ),
            title: "Collection",
            headerShown: true,
            headerTitleStyle: {
              color: "#6486d3",
            },
          }}
        />
        <Stack.Screen
          name="Collection Detail"
          component={CollectionDetail}
          options={{
            title: "Collection",
            headerShown: true,
            headerTintColor: "#6486d3",
          }}
        />
        <Stack.Screen
          name="Collection QR"
          component={CollectionQR}
          options={{
            title: "Share Collection",
            headerShown: true,
            headerTransparent: true,
            headerTintColor: "#6486d3",
          }}
        />
        <Stack.Screen
          name="Image Detail Collection"
          component={ImageDetail}
          options={{
            title: null,
            headerShown: true,
            headerTransparent: true,
            headerBackground: () => (
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }} />
            ),
            headerTintColor: color.gray3,
          }}
        />
      </Stack.Navigator>
    </Animated.View>
  );
};

export default Collection;
