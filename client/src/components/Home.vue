<template>
  <div class="hello">
    <div class="center-vertical" v-if="!loggedIn">
      <div class="container ">
        <div class="col-md-5">
          <div>
            <h1>Trivia quiz</h1>
            <p>Play real time with your friends.</p>
            <div id="google-signin-btn"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="center-vertical" v-if="user && id && loggedIn">
      <div class="container ">
        <div class="row">
          <div class="col-md-5">
            <div class="card">
              <h3>Create a game</h3>
              <form @submit.prevent="createGame">
                <label>Category</label>
                <v-select
                  label="name"
                  v-model="form.category"
                  placeholder="Category"
                  :options="categories"
                ></v-select>
                <label class="label">Number of questions</label>
                <input
                  type="number"
                  v-model="form.questions"
                  max="30"
                  min="1"
                  placeholder="Number of questions"
                />
                <label class="label">Time per question(in seconds)</label>
                <input
                  type="number"
                  v-model="form.time_per_questions"
                  min="10"
                  max="120"
                  placeholder="Time per question(in seconds)"
                />
                <button type="submit" name="button" class="btn">
                  create game
                </button>
              </form>
            </div>
          </div>
          <div class="col-md-2"></div>
          <div class="col-md-5">
            <div class="card">
              <h3>Join a game</h3>
              <form @submit.prevent="joinGame">
                <label>Room Number</label>
                <input
                  type="text"
                  v-model="join"
                  max="30"
                  min="1"
                  placeholder="Room Number"
                />
                <button type="submit" name="button" class="btn">join</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {},
  watch: {
    categories: function(newVal, oldVal) {
      if (newVal != null) {
        this.form.category = this.categories[0]
      }
    }
  },
  created() {},
  mounted() {
    this.getInfo()
  },
  data() {
    return {
      form: {
        category: null,
        password: '',
        questions: 5,
        time_per_questions: 30
      },
      join: '',
      people: [
        {
          name: 'a name'
        },
        {
          name: 'a second name'
        }
      ],
      loggedIn: false
    }
  },
  methods: {
    getInfo() {
      if (!gapi && !loaded) {
        let that = this
        setTimeout(function() {
          that.getInfo()
        }, 1000)
      } else {
        this.loaded = true
        gapi.signin2.render('google-signin-btn', {
          onsuccess: this.onSignIn // note, no "()" here
        })
      }
    },
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile()

      var id_token = googleUser.getAuthResponse().id_token

      let profile_obj = {
        givenName: profile.getGivenName(),
        familyName: profile.getFamilyName(),
        avatar: profile.getImageUrl(),
        email: profile.getEmail(),
        token: id_token
      }
      if ((!this.id && !this.user) || !this.user.just_deleted) {
        this.$store.dispatch('user/login', profile_obj)
        this.loggedIn = true
      }
    },
    createGame() {
      this.$store.dispatch('room/createGame', this.form)
    },
    joinGame() {
      this.$store.dispatch('room/joinGame', { code: this.join })
    },
    create() {
      //this.$store.dispatch("user/addUser", this.form);
    }
  },
  computed: {
    ...mapGetters('user', ['user', 'id']),
    ...mapGetters('category', ['categories'])
  }
}
</script>

<style lang="scss">
.hello {
  float: left;
  width: 100%;
}
.label {
  float: left;
  display: block;
  width: 100%;
  clear: both;
}
body .v-select {
  margin-top: 5px;
  background: #fff;
  border: 2px solid #000;
  padding: 10px 10px;
  margin-bottom: 15px;
  .dropdown-toggle {
    border: none;
  }
}
</style>
