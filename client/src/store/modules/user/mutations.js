import * as types from "@/store/types";
import router from "../../../router";
export default {
  SET_USERS(state, data) {
    state.users = data;
  },
  SET_USER(state, data) {
    state.user = data;
  },
  SET_TOKEN(state, data) {
    state.g_token = data;
  },
  SET_ID(state, data) {
    state.id = data;
  },
  SOCKET_NEW_USER(state, data) {
    state.users.push(data);
  },
  SOCKET_USERS_ONLINE(state, data) {
    state.online_users = data;
  },
  REMOVE_TOKEN(state) {
    state.g_token = null;
    state.user = {just_deleted: 1};
    state.id = null;
    setTimeout( function() {
      state.user = null;
    }, 1000)
  }
};
