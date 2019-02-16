import * as types from "@/store/types";
import router from "../../../router";
export default {
  SET_ROOMS(state, data) {
    state.rooms = data;
  },
  SET_CURRENT_ROOM(state, data) {
    state.currentRoom = data;
  },
  SET_RANKING(state, data) {
    state.ranking = data;
  }
};
