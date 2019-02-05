import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const state = {
  users: [],
  online_users: null,
  user: null,
  id: (localStorage.getItem('id')) ? localStorage.getItem('id') : null,
  g_token: (localStorage.getItem('g_token')) ? localStorage.getItem('g_token') : null
};

export default {
  state,
  getters,
  actions,
  mutations
};