<template>
  <div class="hello">
    <h1>Welcome to the lobby for quiz: {{ $route.params.code }}</h1>
    <p>The quiz will start soon.</p>
  </div>
</template>

<script>
import axios from 'axios'
import {
  mapGetters
} from "vuex";
export default {
  name: 'RoomLobby',
  components: {},
  created(){

  },
  mounted(){
    this.getInfo()
  },
  data(){
    return {
      form: {
        category: null,
        password: '',
        questions: 1
      },
      join: '',
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

    }

  },
  computed: {
    ...mapGetters("user", ["user", "id"]),
    ...mapGetters("category", ["categories"]),
  }
}
</script>

<style lang="scss">

</style>
