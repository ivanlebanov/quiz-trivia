<template>
  <div class="hello" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-body">
              <h1>Welcome to the lobby for quiz: {{ $route.params.code }}</h1>
              <p>The quiz will start soon.</p>
              <ul class="user-list">
                <li v-if="currentRoom.created_by">
                  <img :src="currentRoom.created_by.avatar" alt="" />
                  <div>
                    {{ currentRoom.created_by.firstName }}
                    {{ currentRoom.created_by.lastName }} (organizer)
                  </div>
                </li>

                <li
                  v-for="participant in currentRoom.participants"
                  v-if="
                    currentRoom.participants.length > 0 &&
                      currentRoom.created_by._id != participant.id._id
                  "
                >
                  <img :src="participant.id.avatar" alt="" />
                  <div>
                    {{ participant.id.firstName }} {{ participant.id.lastName }}
                  </div>
                  <button
                    @click="kickUser(participant.id._id)"
                    type="button"
                    name="button"
                    class="btn"
                    v-if="currentRoom.created_by._id == id"
                  >
                    kick out
                  </button>
                </li>
              </ul>
              <button
                @click="startGame()"
                type="button"
                name="button"
                class="btn"
                v-if="currentRoom.created_by._id == id"
              >
                start
              </button>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card card-overflown">
            <div class="card-body" id="messages">
              <h2>Chat</h2>
              <div class="message" v-for="message in currentRoom.messages">
                <strong>{{ message.id.firstName + ' ' + message.id.lastName }}</strong>: {{ message.message }}
              </div>
            </div>
            <form @submit.prevent="addMessage">
              <input type="text" class="form-control" v-model="message" placeholder="Your message">
              <button type="submit" class="btn btn-dark">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'RoomLobby',
  sockets: {
    UPDATED_ROOM: function(data) {
      if (data.code == this.$route.params.code) {
        this.$store.dispatch('room/setRoomData', data)
      }
    },
    newMessage: function(data) {
      if (data.code == this.$route.params.code) {
        let that = this
        setTimeout(function() {
          that.scrollToBottom()
        }, 500)
      }
    },
    GAME_STARTED: function(data) {
      this.$router.push({
        name: 'RoomGame',
        params: { code: this.$route.params.code }
      })
    },
    DELETED_PARTICIPANT: function(data) {
      this.$router.push({ name: 'Home' })
      this.$notify({
        group: 'foo',
        text: `Sorry. You've been kicked out.`,
        type: 'warning'
      })
    }
  },
  data() {
    return {
      message: ''
    }
  },
  created() {
    this.$store.dispatch('room/getRoomData', this.$route.params.code)
    let that = this
    setTimeout(function() {
      that.scrollToBottom()
    }, 200)
  },
  methods: {
    addMessage(){
      if(this.message){
        this.$store.dispatch('room/message', {
          code: this.$route.params.code,
          message: this.message
        }).then(r => {
          this.message = ''
          this.scrollToBottom()
        })
      }
    },
    scrollToBottom(){
      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    },
    kickUser(id) {
      this.$store.dispatch('room/kickUser', {
        code: this.$route.params.code,
        id: id
      })
    },
    startGame() {
      this.$store.dispatch('room/startGame', { code: this.$route.params.code })
    }
  },
  computed: {
    ...mapGetters('user', ['user', 'id']),
    ...mapGetters('room', ['currentRoom'])
  }
}
</script>

<style lang="scss">

</style>
