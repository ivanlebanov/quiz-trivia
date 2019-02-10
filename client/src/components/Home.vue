<template>
  <div class="hello">
    <!-- <h1>Hi</h1>
    <ul>
      <li v-for="person in people">
        {{ person.name }}
      </li>
    </ul>
    <form @submit.prevent="add">
      My username is {{ form.username }} pass: {{ form.password }}
      <input type="text" v-model="form.username">
      <input type="text" v-model="form.password">
      <button type="submit" name="button">add</button>
    </form> -->

    <div class="center-vertical" v-if="!user && !id">
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

    <div class="center-vertical" v-if="user && id">
      <div class="container ">
        <div class="col-md-5">
          <div>
            <h1>Hi, {{ user.firstName }} {{ user.lastName }}!</h1>
          </div>
            <div class="card">
              <div class="card-body">
                <h3>Create a game</h3>
                <form @submit.prevent="createGame">
                  <input type="text" v-model="form.category" placeholder="Category">
                  <input type="number" v-model="form.questions" max="30" min="1" placeholder="Number of questions">
                  <input type="number" v-model="form.time_per_questions" min="10" placeholder="Time per question">
                  <button type="submit" name="button" class="btn">create game</button>
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

import {
  mapGetters
} from "vuex";
export default {
  name: 'Home',
  components: {},
  created(){

  },
  mounted(){
    this.getInfo();
  },
  data(){
    return {
      form: {
        category: '',
        password: '',
        questions: 1
      },
      people:[
        {
          name: 'a name'
        },
        {
          name: 'a second name'
        }
      ]
    }
  },
  methods: {
    getInfo(){
      if(!gapi && !loaded){
        let that = this;
        setTimeout(function() {
          that.getInfo();
        }, 1000)
      }else{
        this.loaded = true;
        gapi.signin2.render('google-signin-btn', { // this is the button "id"
          onsuccess: this.onSignIn // note, no "()" here
        })
      }
    },
    onSignIn(googleUser) {
      var profile = googleUser.getBasicProfile();

      var id_token = googleUser.getAuthResponse().id_token;

      let profile_obj = {
        givenName: profile.getGivenName(),
        familyName: profile.getFamilyName(),
        avatar: profile.getImageUrl(),
        email: profile.getEmail(),
        token: id_token
      };
      console.log(profile_obj);
      if((!this.id && !this.user )|| !this.user.just_deleted){
        this.$store.dispatch("user/login", profile_obj);
      }

    },
    add(){
      console.log(this.form);
      this.$store.dispatch("user/addUser", this.form);
    },
    create () {
      //this.$store.dispatch("user/addUser", this.form);
    }
  },
  computed: {
    ...mapGetters("user", ["user", "id"]),
  }
}
</script>

<style lang="scss">
  .hello{
    float: left;
    width: 100%;
  }
</style>
