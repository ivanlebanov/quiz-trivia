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
      .then(room => {
        router.push({
          name: 'RoomLobby',
          params: {code: room.data.code}
        })
      })
      .catch(r => {
        //dispatch("user/logout", null, { root:true })
      })
  }

};
