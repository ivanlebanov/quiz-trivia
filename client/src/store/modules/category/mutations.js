import * as types from "@/store/types";
import router from "../../../router";
export default {
  SET_CATEGORIES(state, data) {
    state.categories = data;
  }
};
