import * as types from "@/store/types";

export default {
  users: (state, id) => {
    return state.users;
  },
  user: (state, id) => {
    return state.user;
  },
  online_users: (state, id) => {
    return state.online_users;
  },
  id: (state) => {
    return state.id;
  }
};