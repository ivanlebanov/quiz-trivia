import router from "../../../router";
import Vue from "vue";
import axios from "axios";

export default {


  async createGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.post('http://localhost:3000/room', data)
      .then(categories => {
        console.log(categories)
      })
  }

};
