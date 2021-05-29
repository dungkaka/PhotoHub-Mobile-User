import axios from "axios";

const request = {
  server: axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  }),
};

export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("@auth_token");
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return null;
  }
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem("@auth_token", token);
  } catch (e) {
    return null;
  }
};

export default request;
