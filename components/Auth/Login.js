import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  Text,
  View,
  ImageBackground,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/login";
import { setUserFromServer } from "./../../redux/actions/user";
import { color } from "../../utils/f";
import { useDidMountEffect, useGoBackHandler } from "./../../utils/custom-hook";
import Spinner from "react-native-loading-spinner-overlay";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { rainBowGradient, gradient } from "./../../utils/gradient";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Login = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const loginState = useSelector((store) => store.login);

  const username = useRef("");
  const password = useRef("");

  useGoBackHandler(props.navigation);

  useDidMountEffect(() => {
    if (loading) setLoading(false);
    if (loginState.user != null) {
      dispatch(setUserFromServer());
      // props.navigation.navigate("Hub");

      props.navigation.reset({
        routes: [{ name: "App" }],
      });
    }
    if (loginState.error !== null) {
      Alert.alert(
        "Alert",
        loginState.error,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],

        { cancelable: true }
      );
    }
    return () => {};
  }, [loginState]);

  return (
    <ImageBackground
      source={require("./../../assets/images/background-1.jpg")}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      resizeMode="cover"
    >
      <Spinner
        visible={loading}
        textStyle={{ color: "black" }}
        cancelable={true}
        animation="fade"
      />

      <View style={{ alignItems: "center" }}>
        <Image
          source={require("./../../assets/images/logo-back.png")}
          resizeMode="center"
          style={{ width: WIDTH * 0.8, maxHeight: HEIGHT * 0.3 }}
        ></Image>
      </View>

      <View>
        <View style={styles.inputContainer}>
          <AntDesign name="user" style={styles.inputIcon}></AntDesign>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={"rgba(0,0,0,0.4)"}
            onChangeText={(value) => (username.current = value)}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="lastpass"
            style={styles.inputIcon}
          ></MaterialCommunityIcons>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"rgba(0,0,0,0.4)"}
            onChangeText={(value) => (password.current = value)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            setLoading(true);
            dispatch(
              login({
                username: username.current,
                password: password.current,
              })
            );
          }}
        >
          <LinearGradient
            colors={gradient.blue_purple}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.btnLogin}
          >
            <AntDesign
              name="login"
              size={24}
              style={{ color: "white" }}
            ></AntDesign>
            <Text style={styles.textLogin}> LOGIN </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View
          style={{
            marginTop: HEIGHT * 0.06,
            marginBottom: HEIGHT * 0.01,
            height: 1,
            marginHorizontal: WIDTH * 0.05,
            width: WIDTH * 0.7,
            backgroundColor: "rgba(255,255,255,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.btnGoHome}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            {/* <LinearGradient
              style={styles.btnGoHome}
              colors={rainBowGradient.green}
              start={[0, 0]}
              end={[1, 1]}
            > */}
            <AntDesign
              name="home"
              size={24}
              style={{ color: "white" }}
            ></AntDesign>
            {/* 
            <Text style={styles.textGoHome}> BACK </Text> */}
            {/* </LinearGradient> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSignup}
            onPress={() => {
              props.navigation.navigate("Signup");
            }}
          >
            <Text style={styles.textSignup}> Register </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    width: WIDTH * 0.8,
    marginVertical: 5,
    paddingVertical: 10,
    backgroundColor: `rgba(255,255,255,0.65)`,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: color.blueModern2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: `rgba(0,0,0,0.7)`,
    paddingHorizontal: 8,
  },
  inputIcon: {
    fontSize: 20,
    color: `rgba(0,0,0,0.4)`,
    paddingHorizontal: 15,
  },
  btnLogin: {
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 1,
  },
  textLogin: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 10,
    letterSpacing: 1,
  },
  btnSignup: {
    height: 50,
    marginLeft: 5,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 1,
  },
  textSignup: {
    fontSize: 18,
    fontStyle: "italic",
    color: color.blueModern1,
    // fontWeight: "bold",
  },
  btnGoHome: {
    height: 50,
    width: 50,
    flexDirection: "row",
    marginRight: 5,
    borderRadius: 30,
    backgroundColor: gradient.blue_purple[0],
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 1,
  },
  textGoHome: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
});
