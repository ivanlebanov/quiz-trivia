<template>
  <div class="hello" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h1>Welcome to the lobby for quiz: {{ $route.params.code }}</h1>
              <p>The quiz will start soon.</p>
              <ul class="user-list">
                <li v-if="currentRoom.created_by">
                  <img :src="currentRoom.created_by.avatar" alt="">
                  <div>
                    {{ currentRoom.created_by.firstName }} {{ currentRoom.created_by.lastName }} (organizer)
                  </div>
                </li>

                <li v-for="participant in currentRoom.participants" v-if="currentRoom.participants.length > 0 && currentRoom.created_by._id != participant.id._id">
                  <img :src="participant.id.avatar" alt="">
                  <div> {{ participant.id.firstName }} {{ participant.id.lastName }}</div>
                  <button @click="kickUser(participant.id._id)" type="button" name="button" class="btn" v-if="currentRoom.created_by._id == id">kick out</button>
                </li>
              </ul>
              <button @click="startGame()" type="button" name="button" class="btn" v-if="currentRoom.created_by._id == id">start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  name: 'RoomLobby',
  sockets:{
    UPDATED_ROOM: function (data) {
      if(data.code == this.$route.params.code){
        this.$store.dispatch("room/setRoomData", data)
      }
    },
    GAME_STARTED: function (data) {
      this.$router.push({
        name: 'RoomGame',
        params: { code: this.$route.params.code }
      })
    },
    DELETED_PARTICIPANT: function (data) {
        this.$router.push({ name: 'Home' })
        this.$notify({
          group: "foo",
          text: `Sorry. You've been kicked out.`,
          type: "warning"
        })
    }
  },
  created(){
    this.$store.dispatch("room/getRoomData", this.$route.params.code)
  },
  methods: {
    kickUser(id){
      this.$store.dispatch("room/kickUser", { code: this.$route.params.code, id: id })
    },
    startGame(){
      this.$store.dispatch("room/startGame", { code: this.$route.params.code })
    }
  },
  computed: {
    ...mapGetters("user", ["user", "id"]),
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
    .btn{
      float: right;
      margin: -19px 0 0;
    }
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
