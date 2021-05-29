import { COLLECTION } from "../../constant/constant";
import request from "../../utils/axios";
import { URL } from "../../configs/end-points-url";
import { Alert } from "react-native";

export const getListCollection = () => {
  return async (dispatch) => {
    try {
      const response = await request.server.get(URL.GET_COLLECTION());

      const data = response.data;

      if (data.status == true) {
        dispatch(getListCollectionSuccess({ collections: data.collections }));
      } else {
        throw Error(data.message);
      }
    } catch (error) {
      Alert.alert(
        "Alert",
        error.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],

        { cancelable: false }
      );
      dispatch(getListCollectionFail(error.message));
    }
  };
};

export const createCollection = (input, images_snippet) => {
  return async (dispatch) => {
    try {
      const response = await request.server.post(URL.CREATE_COLLECTION(), {
        name: input,
        images_snippet: images_snippet,
        date_create: new Date(),
      });

      const data = response.data;

      if (data.status == true) {
        dispatch(createCollectionSuccess({ collection: data.collection }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(createCollectionFail(error.message));
    }
  };
};

export const deleteCollection = (collection, success, fail) => {
  return async (dispatch) => {
    try {
      const response = await request.server.delete(
        URL.DELETE_COLLECTION(collection.collection_id)
      );

      const data = response.data;
      console.log("DELETE", data);

      if (data.status == true) {
        dispatch(deleteCollectionSuccess(collection));
        success(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      fail(error.message);
      dispatch(deleteCollectionFail(error.message));
    }
  };
};

export const updateCollectionInfor = (
  { collection_id, inforUpdate },
  success,
  fail
) => {
  return async (dispatch) => {
    console.log(
      "INFOR",
      URL.UPDATE_COLLECTION_INFOR(collection_id),
      inforUpdate
    );
    try {
      const response = await request.server.put(
        URL.UPDATE_COLLECTION_INFOR(collection_id),
        {
          ...inforUpdate,
        }
      );

      const data = response.data;

      if (data.status == true) {
        dispatch(updateCollectionInforSuccess({ collection_id, inforUpdate }));
        success(data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      fail(error.message);
      dispatch(updateCollectionInforFail(error.message));
    }
  };
};

export const addImageToCollection = (collection_id, image) => {
  console.log("COLLECTION", URL.ADD_IMAGE_TO_COLLECTION(collection_id));
  return async (dispatch) => {
    try {
      dispatch(addImageToCollectionSuccess({ collection_id, image }));
      const response = await request.server.post(
        URL.ADD_IMAGE_TO_COLLECTION(collection_id),
        {
          image_id: image.id,
        }
      );

      const data = response.data;
      console.log("KAKA", response.data);

      if (data.status == true) {
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert(
        "Alert",
        error.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],

        { cancelable: false }
      );
      dispatch(addImageToCollectionFail(error.message));
      dispatch(deleteImageFromCollectionSucess({ collection_id, image }));
    }
  };
};

export const deleteImageFromCollection = (collection_id, image) => {
  return async (dispatch) => {
    try {
      dispatch(deleteImageFromCollectionSucess({ collection_id, image }));
      const response = await request.server.delete(
        URL.DELETE_IMAGE_FROM_COLLECTION(collection_id),
        {
          data: {
            image_id: image.id,
          },
        }
      );

      const data = response.data;

      console.log("DATA", data);

      if (data.status == true) {
        console.log("TRUE NE");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Alert.alert(
        "Alert",
        error.message,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],

        { cancelable: false }
      );
      dispatch(deleteImageFromCollectionFail(error.message));
      dispatch(addImageToCollectionSuccess({ collection_id, image }));
    }
  };
};

export const deleteImageFromCollectionSucess = ({ collection_id, image }) => ({
  type: COLLECTION.DELETE_IMAGE_FROM_COLLECTION_SUCCESS,
  payload: {
    collection_id,
    image,
  },
});

export const deleteImageFromCollectionFail = (error) => ({
  type: COLLECTION.DELETE_IMAGE_FROM_COLLECTION_FAIL,
  payload: {
    error,
  },
});

export const addImageToCollectionSuccess = ({ collection_id, image }) => ({
  type: COLLECTION.ADD_IMAGE_TO_COLLECTION_SUCCESS,
  payload: {
    collection_id,
    image,
  },
});

export const addImageToCollectionFail = (error) => ({
  type: COLLECTION.ADD_IMAGE_TO_COLLECTION_FAIL,
  payload: {
    error,
  },
});

export const updateCollectionInforSuccess = ({
  collection_id,
  inforUpdate,
}) => ({
  type: COLLECTION.UPDATE_COLLECTION_INFOR_SUCCESS,
  payload: {
    collection_id,
    inforUpdate,
  },
});

export const updateCollectionInforFail = (error) => ({
  type: COLLECTION.UPDATE_COLLECTION_INFOR_FAIL,
  payload: {
    error,
  },
});

export const deleteCollectionSuccess = (collection) => ({
  type: COLLECTION.DELETE_COLLECTION_SUCCESS,
  payload: {
    collection,
  },
});

export const deleteCollectionFail = (error) => ({
  type: COLLECTION.DELETE_COLLECTION_FAIL,
  payload: {
    error,
  },
});

export const createCollectionSuccess = ({ collection }) => ({
  type: COLLECTION.CREATE_COLLECTION_SUCCESS,
  payload: {
    collection,
  },
});

export const createCollectionFail = (error) => ({
  type: COLLECTION.CREATE_COLLECTION_FAIL,
  payload: {
    error,
  },
});

export const getListCollectionSuccess = ({ collections }) => ({
  type: COLLECTION.GET_LIST_COLLECTION_SUCCESS,
  payload: {
    collections,
  },
});

export const getListCollectionFail = (error) => ({
  type: COLLECTION.GET_LIST_COLLECTION_FAIL,
  payload: {
    error,
  },
});
