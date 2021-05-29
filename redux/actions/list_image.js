import { GET_LIST_IMAGE } from "../../constant/constant";
import request from "../../utils/axios";
import * as axios from "axios";
import { URL } from "../../configs/end-points-url";
import { delay } from "../../utils/f";

export const getListImage = (tags, after) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        "https://photohub-e7e04.firebaseapp.com/api/v1/images/search/pagination",
        {
          tags,
        },
        {
          params: {
            after: after,
          },
          cancelToken: new axios.CancelToken((cancel) =>
            setTimeout(cancel, 8000)
          ),
        }
      );

      const data = response.data;

      if (data?.status) {
        dispatch(getListImageSuccess({ listImage: data.images, after: after }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      dispatch(getListImageFail(error.message));
    }
  };
};

export const getListImageSuccess = ({ listImage, after }) => ({
  type: GET_LIST_IMAGE.GET_LIST_IMAGE_SUCCESS,
  payload: {
    listImage,
    after,
  },
});

export const getListImageFail = (error) => ({
  type: GET_LIST_IMAGE.GET_LIST_IMAGE_FAIL,
  payload: {
    error,
  },
});
