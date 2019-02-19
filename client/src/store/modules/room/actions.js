import router from "../../../router";
import Vue from "vue";
import axios from "axios";

export default {


  async createGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.post('http://api.trivia-quiz.xyz/room', data)
      .then(room => {
        router.push({
          name: 'RoomLobby',
          params: {
            code: room.data.code
          }
        })
      })
      .catch(r => {
        //dispatch("user/logout", null, { root:true })
      })
  },
  async getRoomData({
    state,
    commit,
    dispatch
  }, data) {
    axios.get(`http://api.trivia-quiz.xyz/room/${data}`)
      .then(room => {
        console.log(room.data);
        commit('SET_CURRENT_ROOM', room.data)
      })
      .catch(r => {
        //dispatch("user/logout", null, { root:true })
      })
  },
  async setRoomData({
    state,
    commit,
    dispatch
  }, data) {
    commit('SET_CURRENT_ROOM', data)
  },
  async joinGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}`)
      .then(room => {
        if (room.data.error) {
          Vue.notify({
            group: "foo",
            text: `Game has already started.`,
            type: "error"
          });
        } else {
          router.push({
            name: 'RoomLobby',
            params: {
              code: room.data.code
            }
          })
        }

      })
      .catch(r => {
        alert('error');
        //dispatch("user/logout", null, { root:true })
      })
  },
  async addPoints({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}/points`, data)
  },
  async finishGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}/finish`, data)
  },
  async ranking({
    state,
    commit,
    dispatch
  }, data) {
    axios.get(`http://api.trivia-quiz.xyz/ranking`).then(room => {
      commit('SET_RANKING', room.data)
    })
  },
  async kickUser({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}/user/${data.id}`)
      .then(room => {
        commit('SET_CURRENT_ROOM', data)
      })
      .catch(r => {
        alert('error');
      })
  },
  async message({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}/message`, data)
      .then(room => {
        // commit('SET_CURRENT_ROOM', data)
      })
      .catch(r => {
        alert('error');
      })
  },
  async startGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://api.trivia-quiz.xyz/room/${data.code}/start`)
      .then(room => {

      })
      .catch(r => {
        alert('error')
      })
  },

};