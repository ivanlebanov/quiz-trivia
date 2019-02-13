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

    commit('REMOVE_TOKEN');
    setTimeout(function() {

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
      .then(dataObj => {
        axios.defaults.headers.common['x-access-token'] = dataObj.data.token;

        dispatch('setToken', dataObj.data.token);
        dispatch('setId', dataObj.data.id);
        dispatch('getCurrentUser', dataObj.data.id);
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
  async getCurrentUser({
    state,
    commit,
    dispatch
  }, data) {
    if (state.g_token) {

      axios.get('http://localhost:3000/user/' + state.id)
        .then(data => {
          if (data.data) {
            if(state.g_token){
              axios.defaults.headers.common['x-access-token'] = state.g_token
            }

            commit('SET_USER', data.data)
          }else{
            //alert();
            dispatch('logout');
          }
        })
        .catch(r => {
          //alert();
          dispatch('logout');
        })

    }else{
      //dispatch('logout');
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
