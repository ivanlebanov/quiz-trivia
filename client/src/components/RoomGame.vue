<template>
  <div class="hello gameRoom" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <h1>Questions: {{ $route.params.code }}</h1>
            </div>
          </div>

          <div class="card" v-for="question in currentRoom.api_data">
              <h2>{{ question.question }}</h2>
              <div class="row" v-if="question.type == 'boolean'">
                <div class="col">
                  <button type="button" name="button" class="btn">True</button>
                </div>
                <div class="col">
                  <button type="button" name="button" class="btn">False</button>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-sm-6">
                  <button type="button" name="button" class="btn">{{ question.correct_answer }}</button>
                </div>
                <div class="col-sm-6" v-for="incorrect in splitJoin(question.incorrect_answers)">
                  <button type="button" name="button" class="btn">{{ incorrect }}</button>
                </div>
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
  name: 'RoomGame',
  sockets:{
    UPDATED_ROOM: function (data) {
      if(data.code == this.$route.params.code){
        this.$store.dispatch("room/setRoomData", data)
      }
    }
  },
  mounted(){
    if(!this.currentRoom || this.currentRoom.code != this.$route.params.code){
      this.$store.dispatch("room/getRoomData", this.$route.params.code)
    }
    this.proccessQuestions()
  },
  methods: {
    splitJoin(theText){
      return theText.split(',');
    },
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
  .gameRoom{
    .card{
      .btn{
        width: 100%;
        float: left;
        margin: 0 0 15px;
      }
    }
  }
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
