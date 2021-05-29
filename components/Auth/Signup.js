import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useGoBackHandler } from "../../utils/custom-hook";
import Spinner from "react-native-loading-spinner-overlay";
import SignupForm from "./SignupForm";
import SignUpForm from "./SignupForm";
import { FormikRef } from "../Common/FormikCustom/FormikWithRef";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { color } from "../../utils/f";
import { gradient } from "./../../utils/gradient";
import { LinearGradient } from "expo-linear-gradient";
import * as yup from "yup";
import customAlert from "../Common/CustomAlert";
import request from "./../../utils/axios";
import { URL } from "./../../configs/end-points-url";

const validateSchema = yup.object().shape({
  username: yup
    .string()
    .required()
    .min(6)
    .max(15)
    .test("nospace", "usename can not contain space letter", (val) => {
      return !(val + "1").includes(" ");
    }),
  password: yup.string().required().min(6).max(10),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Confirm Password need to match Password"),
  email: yup.string().required().email(),
  name: yup.string().required(),
});

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const Signup = (props) => {
  useGoBackHandler(props.navigation);
  const formRef = useRef();

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const {
      validateForm,
      setTouched,
      isValid,
      values,
      resetForm,
    } = formRef.current.form;
    try {
      setLoading(true);
      const checkValidate = await validateForm();
      setTouched({ ...checkValidate });
      console.log(values);
      if (!isValid) {
        throw new Error("Form must be filled rightly !");
      }

      const response = await request.server.post(URL.SIGNUP(), {
        ...values,
        confirm: values.confirmPassword,
        age: parseInt(values.age),
        name: values.username,
      });
      const data = response.data;

      if (data.status) {
        resetForm();
        throw new Error("Register account success !");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setLoading(false);
      customAlert(error.message);
    }
  };

  const handleSubmit = () => {
    console.log(formRef.current.form.values);
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Spinner
          visible={loading}
          textStyle={{ color: "black" }}
          cancelable={true}
          animation="fade"
        />

        <FormikRef
          ref={formRef}
          initialValues={{ email: "" }}
          validationSchema={validateSchema}
          validateOnBlur={true}
          onSubmit={(values) => console.log(values)}
        >
          {(props) => <SignUpForm {...props} handleSignup={handleSubmit} />}
        </FormikRef>

        <View
          style={{
            marginTop: 5,
            marginBottom: 5,
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
            width: WIDTH * 0.8,
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            style={styles.btnSignup}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={styles.textSignup}> Login </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                handleRegister();
              }}
            >
              <LinearGradient
                colors={gradient.blue_purple}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.btnSignup, { backgroundColor: "transparent" }]}
              >
                <AntDesign
                  name="login"
                  size={24}
                  style={{ color: "white" }}
                ></AntDesign>
                <Text style={styles.textLogin}> REGISTER </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
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
    flexDirection: "row",
    height: 50,
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
