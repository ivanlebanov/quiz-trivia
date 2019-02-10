import router from "../../../router";
import Vue from "vue";
import axios from "axios";

export default {


  async getCategories({
    state,
    commit,
    dispatch
  }, data) {
    axios.get('http://localhost:3000/categories')
      .then(categories => commit('SET_CATEGORIES', categories.data))
  }

};
