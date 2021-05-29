const initState = () => {
  return {
    tags: [],
    error: null,
  };
};

export default (state = initState(), { type, payload }) => {
  switch (type) {
    case "GET_TAGS_SUCCESS":
      return {
        ...state,
        tags: payload.tags,
        error: null,
      };
    default:
      return state;
  }
};
