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
    axios.get(`http://localhost:3000/room/${data}`)
      .then(room => {
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
    axios.put(`http://localhost:3000/room/${data.code}`)
      .then(room => {
        router.push({
          name: 'RoomLobby',
          params: {
            code: room.data.code
          }
        })
      })
      .catch(r => {
        alert('error');
        //dispatch("user/logout", null, { root:true })
      })
  },
  async kickUser({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://localhost:3000/room/${data.code}/user/${data.id}`)
      .then(room => {
        commit('SET_CURRENT_ROOM', data)
      })
      .catch(r => {
        alert('error');
        //dispatch("user/logout", null, { root:true })
      })
  },
  async startGame({
    state,
    commit,
    dispatch
  }, data) {
    axios.put(`http://localhost:3000/room/${data.code}/start`)
      .then(room => {
        commit('SET_CURRENT_ROOM', data)
      })
      .catch(r => {
        alert('error')
      })
  },

};
