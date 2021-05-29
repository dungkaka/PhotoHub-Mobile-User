import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import QRCollection from "./Collection";
import Animated from "react-native-reanimated";
import * as Permissions from "expo-permissions";
import ScannerQR from "./Collection/index";
import QRCollectionDetail from "./Collection/CollectionDetail";
import { AntDesign } from "@expo/vector-icons";
import ImageZoom from "./Collection/ImageZoom";
import { color } from "./../../utils/f";

const Stack = createStackNavigator();

const QRCode = ({ navigation, style }) => {
  return (
    <Animated.View style={StyleSheet.flatten([styles.stack, style])}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            elevation: 0,
            backgroundColor: "#f2f2f2",
          },
        }}
      >
        <Stack.Screen
          name="Scanner"
          component={ScannerQR}
          options={{
            headerTransparent: true,
            headerTintColor: "white",
            headerLeft: ({ onPress }) => (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{
                  marginLeft: 20,
                  alignContent: "center",
                }}
              >
                <AntDesign name="menufold" size={24} color="white"></AntDesign>
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="QR Collection Detail"
          component={QRCollectionDetail}
          options={{
            title: "Share Collection",
            headerShown: true,
            headerTintColor: "#6486d3",
          }}
        />

        <Stack.Screen
          name="ImageZoom"
          component={ImageZoom}
          options={{
            title: null,
            headerShown: true,
            headerTransparent: true,
            headerBackground: () => (
              <View
                style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.3)" }}
              />
            ),
            headerTintColor: color.gray10,
          }}
        />
      </Stack.Navigator>
    </Animated.View>
  );
};

export default QRCode;

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    overflow: "hidden",
    elevation: 8,
    backgroundColor: "white",
  },
});
