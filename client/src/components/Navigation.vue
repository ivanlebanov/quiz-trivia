<template lang="html">
  <nav class="navigation">
    <div class="container">
      <div class="row">
        <div class="col-md-5">
          <router-link :to="{ name: 'Home' }" class="logo" tag="h1">
            Trivia quiz
          </router-link>
        </div>
        <div class="col-md-7">
          <!--  navigation elements -->
          <ul>
            <li>{{ user.firstName }} {{ user.lastName }}</li>
            <li>
              <router-link :to="{ name: 'Ranking' }">Ranking</router-link>
            </li>
            <li>
              <a href="#" @click.prevent.default="logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
  data() {
    return {
      isActiveMenu: false,
      isActiveInviteMenu: false,
      term: '',
      suggestions: [],
      delay: 500
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout')
      this.$socket.emit('disconnect')
      setTimeout(function() {
        location.reload()
      }, 1000)
    }
  },
  computed: {
    ...mapGetters('user', ['user', 'id'])
  }
}
</script>

<style lang="scss">
.navigation {
  float: left;
  width: 100%;
  background: #fff;
  box-shadow: 0 1px 20px 0 rgba(46, 61, 73, 0.2);
  padding: 0.8em;
  .logo {
    cursor: pointer;
  }
  li {
    float: left;
    display: block;
    margin-left: 15px;
    position: relative;
  }
  a {
    float: left;
    display: block;
    width: 100%;
  }
  .avatar {
    float: left;
    display: block;
    max-height: 35px;
    margin-right: 10px;
    border-radius: 50%;
    margin-top: 0;
  }
  h1 {
    float: left;
    margin: 0;
    padding: 0;
  }
  ul {
    float: right;
    margin: 10px 0 0;
    padding: 0;
    list-style: none;
    li {
      position: relative;
      svg {
        margin-top: 5px;
      }
      span.name {
        margin-top: 10px;
        display: block;
        float: left;
      }
    }
  }
}
</style>
