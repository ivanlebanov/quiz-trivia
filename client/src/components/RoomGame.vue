<template>
  <div class="hello gameRoom" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          {{ currentRoom.time_per_questions }}
          {{ time }}


          <div class="card" v-for="(question, index) in currentRoom.api_data" v-if="question_number == index">
              <h2 v-html="(index + 1) + '. ' +question.question"></h2>
              <div class="row" v-if="question.type == 'boolean'">
                <div class="col">
                  <button type="button" name="button" class="btn" @click="selectAnswer(index, 'True')">True</button>
                </div>
                <div class="col">
                  <button type="button" name="button" class="btn" @click="selectAnswer(index, 'False')">False</button>
                </div>
              </div>
              <div class="row" v-else>
                <div class="col-sm-6" v-for="incorrect in splitJoin(question.incorrect_answers)">
                  <button type="button" name="button" class="btn" @click="selectAnswer(index, incorrect)" v-html="incorrect"></button>
                </div>
              </div>
          </div>

          <div class="card" v-if="question_number == currentRoom.api_data.length">
            <div class="card-body">
              <h2>Correct answers: {{ corrects }}</h2>
              <ul class="user-list">
                <li v-for="participant in currentRoom.participants" v-if="currentRoom.participants.length > 0">
                  <img :src="participant.id.avatar" alt="">
                  <div>
                    {{ participant.id.firstName }} {{ participant.id.lastName }}
                    <span v-if="participant.finished">
                      (finished)
                    </span>
                  </div>
                  {{ participant.points }} points
                </li>
              </ul>
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
      console.log(data);
      if(data.code == this.$route.params.code){
        this.$store.dispatch("room/setRoomData", data)
      }
    }
  },
  data(){
    return{
      question_number: 0,
      corrects: 0,
      timer: null,
      time: 0,
      isRunning: false,
      interval: null
    }
  },
  mounted(){
    this.$store.dispatch("room/getRoomData", this.$route.params.code)
    this.proccessQuestions()
  },
  methods: {
    proccessQuestions(){
      let that = this

      if(that.currentRoom && that.currentRoom.api_data){
        let ms = that.currentRoom.time_per_questions * 1000
        that.question_number = 0
        that.toggleTimer()

        that.timer = setInterval(function() {
          if(that.currentRoom.api_data.length > that.question_number){
            that.question_number++
            that.time = 0

          }
        }, ms)
      }else{
        setTimeout(function() {
          that.proccessQuestions()
        }, 100);
      }

    },

    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval);
        console.log('timer stops');
      } else {
        this.interval = setInterval(this.incrementTime, 1000);
      }
      this.isRunning = !this.isRunning
    },
    incrementTime() {
      this.time = parseInt(this.time) + 1;
    },

    selectAnswer(index, answer){
      if(this.currentRoom.api_data[index].correct_answer === answer){
        this.$notify({
          group: "foo",
          text: `Correct answer.`,
          type: "success"
        })
        this.addPoints(index, answer)
      }else{
        this.$notify({
          group: "foo",
          text: `Wrong answer. Correct answer was ${this.currentRoom.api_data[index].correct_answer}`,
          type: "error"
        })
        this.addPoints(index, false)
      }
      this.question_number++
      if(this.question_number == this.currentRoom.api_data.length){
        this.$store.dispatch("room/finishGame", { code: this.$route.params.code })
      }
      this.restartQuestionTimer()
    },
    addPoints(index, correct){
      let points = 100
      let percentage = this.time / this.currentRoom.time_per_questions
      if(percentage < 0.33){
        points = points + 100
      }else if (percentage > 0.33 &&  percentage < 0.66) {
        points = points + 50
      }
      if(!correct){

        points = 0
      }else{
        this.corrects++
      }
      alert(points);
      this.$store.dispatch("room/addPoints", { code: this.$route.params.code, points: points, corrects: this.corrects, question: this.question_number })

    },
    restartQuestionTimer(){
      let that = this
      clearInterval(this.timer)
      let ms = that.currentRoom.time_per_questions * 1000
      that.time = 0
      this.timer = setInterval(function() {
        if(that.currentRoom.api_data.length > that.question_number){
          that.question_number++
          that.time = 0
        }
      }, ms);
    },
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
