<template>
  <div class="hello">

    <div class="container" v-if="ranking && ranking.length > 0">
      <div class="row">
        <div class="col-md-12">
          <h1>Results:</h1>
          <ul class="user-list">
            <li v-for="(participant, index) in ranking" v-if="ranking.length > 0">

              <img :src="participant.avatar" alt="">
              <div>
                {{ index + 1 }}.
                {{ participant.firstName }} {{ participant.lastName }}
              </div>
              {{ participant.points }} points
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from "vuex"
export default {
  name: 'Ranking',
  created(){

  },
  mounted(){
    this.getInfo();
  },
  data(){
    return {
    }

  },
  methods: {
    getInfo(){
      this.$store.dispatch("room/ranking")
    }

  },
  computed: {
    ...mapGetters("room", ["ranking"])
  }
}
</script>

<style lang="scss">
  .hello{
    float: left;
    width: 100%;
  }
  .label{
    float: left;
    display: block;
    width: 100%;
    clear: both;
  }
  body .v-select{
    margin-top: 5px;
    background: #fff;
    border: 2px solid #000;
    padding: 10px 10px;
    margin-bottom: 15px;
   .dropdown-toggle{
     border: none;
   }
  }
</style>
