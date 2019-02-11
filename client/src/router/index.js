import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import RoomLobby from '@/components/RoomLobby'
import store from '@/store'
Vue.use(Router)

let router;

export default router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/room/lobby/:code',
      name: 'RoomLobby',
      component: RoomLobby
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAdmin)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//
//     if (!store.getters.isLoggedIn) {
//       next({
//         path: '/login',
//         query: {
//           redirect: to.fullPath
//         }
//       })
//     } else {
//       var config = {
//         headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Bearer ' + store.getters.isLoggedIn
//         }
//       }
//       axios.get('http://localhost:3000/user/authenticated', config)
//         .then(function(response) {
//           if (response.data.success.is_admin) {
//             store.dispatch('bodyClass', 'admin')
//             next()
//           } else {
//             next({
//               path: '/'
//             })
//           }
//         })
//     }
//   } else {
//     next() // make sure to always call next()!
//   }
// })
