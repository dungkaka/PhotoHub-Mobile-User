import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import Hub from "./Hub/index";
import ImageDetail from "./ImageDetail/index";
import { createStackNavigator } from "@react-navigation/stack";
import Animated from "react-native-reanimated";
import styles from "./index.style";
import ImageZoom from "./ImageDetail/ImageZoom";
import { color } from "./../../utils/f";
import Category from "./Category/index";
const background = require("./../../assets/images/logo-2.png");

const Stack = createStackNavigator();

const PhotoHub = ({ navigation, style }) => {
  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator headerMode="float">
        <Stack.Screen
          headerMode="none"
          options={{
            headerShown: false,
          }}
          name="Hub"
        >
          {(props) => <Hub {...props} drawerAppNavigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen
          name="Image Detail"
          component={ImageDetail}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerBackground: () => <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />,
            headerTintColor: color.gray10,
          }}
        />
        <Stack.Screen
          name="Image Zoom"
          component={ImageZoom}
          options={{
            title: null,
            headerShown: true,
            headerTransparent: true,
            headerBackground: () => <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.3)" }} />,
            headerTintColor: color.gray10,
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            headerShown: true,
            headerStyle: {
              elevation: 0,
              backgroundColor: "#f2f2f2",
            },
            // headerTransparent: true,
            // headerBackground: () => (
            //   <View
            //     style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.3)" }}
            //   />
            // ),
            headerTintColor: color.blueModern1,
            headerTitle: (props) => (
              <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: -15,
                  }}
                >
                  <Image
                    source={background}
                    style={{
                      maxHeight: 30,
                      width: "auto",
                      aspectRatio: 1,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  {...props}
                  style={{
                    backgroundColor: color.blueModernDark,
                    paddingHorizontal: 20,
                    paddingVertical: 6,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                    borderRadius: 10,
                  }}
                >
                  CATEGORIES
                </Text>
              </View>
            ),
          }}
        />
      </Stack.Navigator>
    </Animated.View>
  );
};

export default PhotoHub;
