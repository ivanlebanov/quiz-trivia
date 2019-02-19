import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store"
import VueSocketIO from 'vue-socket.io'
import Meta from "vue-meta"
import Notifications from "vue-notification"
import VueSweetalert2 from 'vue-sweetalert2'
import vSelect from 'vue-select'
import axios from 'axios'

Vue.component('v-select', vSelect)
Vue.use(VueSweetalert2)
Vue.use(Meta)
Vue.use(Notifications)
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://trivia-quiz.xyz:3000',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))
if (localStorage.getItem('g_token')) {
  axios.defaults.headers.common['x-access-token'] = localStorage.getItem('g_token')
}

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')