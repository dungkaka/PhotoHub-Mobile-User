import { GET_LIST_IMAGE } from "../../constant/constant";

const initState = () => {
  return {
    error: null,
    listImage: [],
    pageIndex: -1,
  };
};

export default (state = initState(), { type, payload }) => {
  switch (type) {
    case GET_LIST_IMAGE.GET_LIST_IMAGE_SUCCESS:
      const { listImage, after } = payload;
      // Case after == "" that mean start app, refresh
      // Case after != "" that mean fetchMore
      if (listImage.length > 0) {
        // Case not end of the List
        if (after == "")
          return {
            ...state,
            listImage: listImage,
            pageIndex: 1,
            error: null,
          };
        return {
          ...state,
          listImage: [...state.listImage, ...listImage],
          pageIndex: state.pageIndex + 1,
          error: null,
        };
      } else {
        // Case end of the List or resultSearch = empty
        if (after == "")
          return {
            ...state,
            listImage: listImage,
            pageIndex: -1,
            error: null,
          };
        else
          return {
            ...state,
            listImage: [...state.listImage],
            pageIndex: -1,
            error: null,
          };
      }

    case GET_LIST_IMAGE.GET_LIST_IMAGE_FAIL:
      return {
        ...state,
        error: payload.error,
      };

    default:
      return state;
  }
};
