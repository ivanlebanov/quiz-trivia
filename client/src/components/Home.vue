<template>
  <div class="hello">
    <h1>Hi</h1>
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
    </form>
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
  data(){
    return {
      form: {
        username: '',
        password: ''
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
    add(){
      console.log(this.form);
      this.$store.dispatch("user/addUser", this.form);
    },
    create () {
      //this.$store.dispatch("user/addUser", this.form);
    }
  },
  computed: {}
}
</script>

<style lang="scss">
  .hello{
    float: left;
    width: 100%;
  }
</style>
