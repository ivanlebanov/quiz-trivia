import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const state = {
  rooms: [],
  currentRoom: null
};

export default {
  state,
  getters,
  actions,
  mutations
};
