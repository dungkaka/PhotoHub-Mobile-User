import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import styles from "./index.style";
import Signup from "./Signup";
import Login from "./Login";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

const Stack = createStackNavigator();

const AuthStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      headerMode="none"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

export default AuthStack;
