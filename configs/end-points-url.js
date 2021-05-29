const preUrl = "https://photohub-e7e04.firebaseapp.com/api/v1/";
// const preUrl = "http://192.168.1.104:5000/api/v1/";

export const URL = {
  LOGIN: () => {
    return preUrl + "login";
  },

  SIGNUP: () => {
    return preUrl + "signup";
  },

  GET_USER: () => {
    return preUrl + "auth/me";
  },

  GET_TAGS: () => {
    return preUrl + "tags";
  },

  GET_LIST_IMAGE_BY_TAG_PAGINATION: () => {
    return preUrl + "images/search/pagination";
  },

  GET_COLLECTION: () => {
    return preUrl + "collections";
  },

  GET_COLLECION_ID: (collection_id) => {
    return preUrl + `collections/${collection_id}`;
  },

  CREATE_COLLECTION: () => {
    return preUrl + "collections/create";
  },

  DELETE_COLLECTION: (collection_id) => {
    return preUrl + `collections/${collection_id}`;
  },

  UPDATE_COLLECTION_INFOR: (collection_id) => {
    return preUrl + `collections/${collection_id}`;
  },

  LIKE_IMAGE: (image_id) => {
    return preUrl + `images/${image_id}/like`;
  },
  UNLIKE_IMAGE: (image_id) => {
    return preUrl + `images/${image_id}/like`;
  },

  ADD_IMAGE_TO_COLLECTION: (collection_id) => {
    return preUrl + `collections/${collection_id}/add-image`;
  },

  DELETE_IMAGE_FROM_COLLECTION: (collection_id) => {
    return preUrl + `collections/${collection_id}/delete-image`;
  },

  GET_COLLECTION_BY_QR: (ownUser, collectionId) => {
    return (
      preUrl +
      `collections/QR/get?ownUser=${ownUser}&collectionId=${collectionId}`
    );
  },

  CLONE_COLLECTION: () => {
    return preUrl + `collections/QR/clone`;
  },

  SEARCH_NEARBY: () => {
    return preUrl + `booking/search`;
  },
  GET_LIST_ACTIVE_CHAT: () => {
    return preUrl + "chats/active-room";
  },
  GET_LIST_INACTIVE_CHAT: () => {
    return preUrl + "chats/inactive-room";
  },
  DEACTIVATE_CHATROOM: (chatId) => {
    return preUrl + `chats/${chatId}/deactivate`;
  },
  DELETE_CHATROOM: (chatId) => {
    return preUrl + `chats/${chatId}`;
  },
};
