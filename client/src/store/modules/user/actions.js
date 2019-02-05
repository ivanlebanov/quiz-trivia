import router from "../../../router";
import Vue from "vue";
import axios from "axios";

export default {
  async logout({
    state,
    commit,
    dispatch
  }, data) {
    if(gapi.auth2){
      gapi.auth2.getAuthInstance().disconnect();
    }
  
    setTimeout(function() {
      commit('REMOVE_TOKEN');
      localStorage.removeItem("id");
      localStorage.removeItem("g_token");
      if(!data){
        Vue.notify({
          group: "foo",
          text: "Bye.",
          type: "success"
        });
      }

      router.push({
        name: 'Home'
      });
    }, 1000)


  },

  async getUsers({
    state,
    commit,
    dispatch
  }, data) {
    axios.get('http://localhost:3000/users')
      .then(users => commit('SET_USERS', users.data))
  },
  async login({
    state,
    commit,
    dispatch
  }, data) {
    axios.post('http://localhost:3000/auth/google', data)
      .then(data => {
        dispatch('setToken', data.data.token);
        dispatch('setId', data.data.id);
        dispatch('getUser', data.data.token);
      })
      .catch(r => {
        dispatch('logout', true);
        Vue.notify({
          group: "foo",
          text: `${r.response.data.error}`,
          type: "error"
        });
      })
  },
  async setToken({
    state,
    commit,
    dispatch
  }, data) {
    localStorage.setItem("g_token", data);
    commit('SET_TOKEN', data);
  },

  async setId({
    state,
    commit,
    dispatch
  }, data) {
    localStorage.setItem("id", data);
    commit('SET_ID', data);
    router.push({
      name: 'Home'
    });
  },
  async getUser({
    state,
    commit,
    dispatch
  }, data) {
    if (state.g_token) {
      let user = await axios.get('http://localhost:3000/user/' + state.g_token || data)
      if (user.data) {
        commit('SET_USER', user.data)
      }
    }


  },

  async addUser({
    state,
    commit,
    dispatch
  }, data) {
    axios.post('http://localhost:3000/user', data)
  }

};
