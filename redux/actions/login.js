import { LOGIN } from "../../constant/constant";
import request from "../../utils/axios";
import * as axios from "axios";
import { URL } from "../../configs/end-points-url";
import { AsyncStorage } from "react-native";
import { setUser } from "./user";
import {
  registerForPushNotificationsAsync,
  listenChatNotification,
} from "./../../utils/notification";

export const login = (user) => {
  return async (dispatch) => {
    try {
      const tokenPushNotification = await registerForPushNotificationsAsync();

      const response = await request.server.post(
        URL.LOGIN(),
        {
          username: user.username,
          password: user.password,
          tokenPushNotification: tokenPushNotification,
        },
        {
          cancelToken: new axios.CancelToken((cancel) =>
            setTimeout(cancel, 8000)
          ),
        }
      );

      const data = response.data;

      if (data.status == true) {
        dispatch(loginSuccess({ user: data.user }));
        dispatch(setUser(data.user));
        listenChatNotification();
        AsyncStorage.setItem("userToken", data.access_token);
        AsyncStorage.setItem("user", JSON.stringify(data.user));
        AsyncStorage.setItem("tokenPushNotification", tokenPushNotification);

        request.server = await axios.create({
          headers: {
            Authorization: "Bearer " + data.access_token,
            "Content-Type": "application/json",
          },
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      if (axios.isCancel(error))
        return dispatch(loginFail("Timeout, try again !"));
      dispatch(loginFail(error.message));
    }
  };
};

export const requestLogin = () => ({
  type: LOGIN.LOGIN_REQUEST,
});

export const loginSuccess = ({ user }) => ({
  type: LOGIN.LOGIN_SUCCESS,
  payload: {
    user,
  },
});

export const loginFail = (error) => ({
  type: LOGIN.LOGIN_FAIL,
  payload: {
    error,
  },
});
