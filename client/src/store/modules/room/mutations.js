import * as types from "@/store/types";
import router from "../../../router";
export default {
  SET_ROOMS(state, data) {
    state.rooms = data;
  }
};
