import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Picker,
  ScrollView,
  Image,
} from "react-native";
import { createFormRef, FormikRef } from "../Common/FormikCustom/FormikWithRef";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { gradient } from "./../../utils/gradient";
import { color } from "../../utils/f";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const SignUpForm = createFormRef((props) => {
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    handleSignup,
    errors,
    touched,
  } = props;

  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={{ alignItems: "center" }}>
        <Image
          source={require("./../../assets/images/logo-back.png")}
          resizeMode="center"
          style={{ width: WIDTH * 0.8, maxHeight: HEIGHT * 0.3, marginTop: 30 }}
        ></Image>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: -80,
          marginBottom: 20,
        }}
      >
        <View>
          <View style={styles.inputContainer}>
            <AntDesign name="user" style={styles.inputIcon}></AntDesign>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={"rgba(0,0,0,0.4)"}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
            />
          </View>
          {errors.username && touched.username && (
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {errors.username}
            </Text>
          )}
        </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lastpass"
              style={styles.inputIcon}
            ></MaterialCommunityIcons>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={"rgba(0,0,0,0.4)"}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
          </View>
          {errors.password && touched.password && (
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {errors.password}
            </Text>
          )}
        </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lastpass"
              style={styles.inputIcon}
            ></MaterialCommunityIcons>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={"rgba(0,0,0,0.4)"}
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              secureTextEntry
            />
          </View>
          {errors.confirmPassword && touched.confirmPassword && (
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="rename-box"
              style={styles.inputIcon}
            ></MaterialCommunityIcons>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={"rgba(0,0,0,0.4)"}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
          </View>
          {errors.username && touched.name && (
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {errors.name}
            </Text>
          )}
        </View>

        <View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email"
              style={styles.inputIcon}
            ></MaterialCommunityIcons>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"rgba(0,0,0,0.4)"}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
          </View>
          {errors.email && touched.email && (
            <Text
              style={{
                color: "white",
                marginBottom: 10,
                paddingHorizontal: 20,
              }}
            >
              {errors.email}
            </Text>
          )}
        </View>

        <View style={[styles.inputContainer, { paddingVertical: 0 }]}>
          <MaterialCommunityIcons
            name="gender-male-female"
            style={styles.inputIcon}
          ></MaterialCommunityIcons>
          <Picker
            placeholder="Gender"
            selectedValue={values.gender}
            style={[styles.input, { backgroundColor: "transparent" }]}
            onValueChange={handleChange("gender")}
            prompt="Gender"
            //   mode="dropdown"
          >
            <Picker.Item label="No gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
          </Picker>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="face"
            style={styles.inputIcon}
          ></MaterialCommunityIcons>
          <TextInput
            keyboardType="numeric"
            style={styles.input}
            placeholder="Age"
            placeholderTextColor={"rgba(0,0,0,0.4)"}
            onChangeText={handleChange("age")}
            onBlur={handleBlur("age")}
            value={values.age}
          />
        </View>
      </View>
    </ScrollView>
  );
});

export default SignUpForm;

const styles = StyleSheet.create({
  inputContainer: {
    width: WIDTH * 0.8,
    marginVertical: 4,
    paddingVertical: 9,
    backgroundColor: `rgba(255,255,255,0.65)`,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: color.blueDark,
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
