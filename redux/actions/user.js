import { AsyncStorage } from "react-native";
import request from "../../utils/axios";
import { URL } from "../../configs/end-points-url";
import { loginSuccess } from "./login";

export const setUser = (user) => ({
  type: "SET_USER_SUCCESS",
  payload: {
    user,
  },
});

export const setUserFromAsyncStorage = () => {
  return async (dispatch) => {
    dispatch({ type: "SET_USER_START" });
    let user = null;
    let userAsync = null;
    try {
      userAsync = await AsyncStorage.getItem("user");
      user = JSON.parse(userAsync);
    } catch (error) {
      user = null;
    }

    try {
      dispatch(setUser(user));
    } catch (error) {
      console.log(error.message);
    }
  };
};

export const setUserFromServer = () => {
  return async (dispatch) => {
    dispatch({ type: "SET_USER_START" });
    try {
      const response = await request.server.get(URL.GET_USER());
      const data = response.data;

      if (data.user) {
        dispatch(setUser(data.user));
        AsyncStorage.setItem("user", JSON.stringify(data.user));
      } else {
        throw new Error("Can not retrieve user from Server");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
};
