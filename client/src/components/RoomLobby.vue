<template>
  <div class="hello" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>Welcome to the lobby for quiz: {{ $route.params.code }}</h1>
          <p>The quiz will start soon.</p>
          <!-- {{ currentRoom }} -->
          <ul class="user-list">
            <li v-if="currentRoom.created_by">
              <img :src="currentRoom.created_by.avatar" alt="">
              <div>
                {{ currentRoom.created_by.firstName }} {{ currentRoom.created_by.lastName }} (organizer)
              </div>
            </li>

            <li v-for="participant in currentRoom.participants" v-if="currentRoom.participants.length > 0">
              <img :src="participant.id.avatar" alt="">
              <div> {{ participant.id.firstName }} {{ participant.id.lastName }}</div>
            </li>
          </ul>
          <button type="button" name="button" class="btn" v-if="currentRoom.created_by._id == id">start</button>
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
  name: 'RoomLobby',
  components: {},
  created(){

  },
  sockets:{
    NEW_PARTICIPANT: function (data) {
      console.log(data)
      if(data.code == this.$route.params.code){
        this.$store.dispatch("room/setRoomData", data)
      }
    }
  },
  mounted(){
    this.$store.dispatch("room/getRoomData", this.$route.params.code)
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
    ...mapGetters("room", ["currentRoom"]),
  }
}
</script>

<style lang="scss">
  .user-list{
    list-style: none;
    float: left;
    width: 100%;
    margin: 0;
    padding: 0;
    li{
      margin-bottom: 10px;
      display: block;
      float: left;
      width: 100%;
      div{
        padding-top: 1em;
      }
    }
    img{
      box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
      border-radius: 50%;
      display: block;
      float: left;
      max-width: 50px;
      margin: 0 1em 0 0
    }
  }
</style>
