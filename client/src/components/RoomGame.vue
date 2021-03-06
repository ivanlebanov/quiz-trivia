<template>
  <div class="hello gameRoom" v-if="currentRoom">
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="time">
            <h1
              v-if="
                currentRoom.time_per_questions - time > 0 &&
                  question_number < currentRoom.api_data.length
              "
              style="margin-right:15px;color:#fff"
            >
              <template
                v-for="participant in currentRoom.participants"
                v-if="
                  currentRoom.participants.length > 0 &&
                    id == participant.id._id
                "
              >
                Score: {{ participant.points }}
              </template>
            </h1>
          </div>
        </div>
        <div class="col-md-6">
          <div class="time">
            <h1
              v-if="
                currentRoom.time_per_questions - time > 0 &&
                  question_number < currentRoom.api_data.length
              "
              style="text-align:right;margin-right:15px;color:#fff"
            >
              {{ currentRoom.time_per_questions - time }}
            </h1>
          </div>
        </div>
        <div class="col-md-8">
          <div
            class="card"
            v-for="(question, index) in currentRoom.api_data"
            v-if="question_number == index"
          >
            <h2 v-html="index + 1 + '. ' + question.question"></h2>
            <div class="row" v-if="question.type == 'boolean'">
              <div class="col">
                <button
                  type="button"
                  name="button"
                  class="btn"
                  @click="selectAnswer(index, 'True')"
                >
                  True
                </button>
              </div>
              <div class="col">
                <button
                  type="button"
                  name="button"
                  class="btn"
                  @click="selectAnswer(index, 'False')"
                >
                  False
                </button>
              </div>
            </div>
            <div class="row" v-else>
              <div
                class="col-sm-6"
                v-for="incorrect in splitJoin(question.incorrect_answers)"
              >
                <button
                  type="button"
                  name="button"
                  class="btn"
                  @click="selectAnswer(index, incorrect)"
                  v-html="incorrect"
                ></button>
              </div>
            </div>
          </div>

          <div
            class="card"
            v-if="question_number == currentRoom.api_data.length"
          >
            <div class="card-body">
              <h1>Results:</h1>
              <ul class="user-list">
                <li
                  v-for="(participant, index) in even(currentRoom.participants)"
                  v-if="currentRoom.participants.length > 0"
                >
                  <img :src="participant.id.avatar" alt="" />
                  <div>
                    {{ index + 1 }}. {{ participant.id.firstName }}
                    {{ participant.id.lastName }}
                    <span v-if="participant.finished">
                      (finished)
                    </span>
                  </div>
                  {{ participant.points }} points
                  {{ participant.corrects }} correct answers
                </li>
              </ul>
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
  name: 'RoomGame',
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
    }
  },
  data() {
    return {
      question_number: 0,
      corrects: 0,
      timer: null,
      time: 0,
      isRunning: false,
      interval: null,
      message: ''
    }
  },
  mounted() {
    this.$store.dispatch('room/getRoomData', this.$route.params.code)
    this.proccessQuestions()
  },
  methods: {
    scrollToBottom(){
      var objDiv = document.getElementById("messages");
      objDiv.scrollTop = objDiv.scrollHeight;
    },
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
    even(arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function(a, b) {
        return b.points - a.points
      })
    },
    finishedGame(id) {
      for (var i = 0; i < this.currentRoom.participants.length; i++) {
        if (
          this.currentRoom.participants[i].id._id == id &&
          this.currentRoom.participants[i].finished
        ) {
          return true
        }
      }

      return false
    },
    proccessQuestions() {
      let that = this

      if (that.currentRoom && that.currentRoom.api_data) {
        let isfinishedGame = this.finishedGame(this.id)
        if (isfinishedGame) {
          that.question_number = that.currentRoom.api_data.length
        } else {
          let ms = that.currentRoom.time_per_questions * 1000
          that.question_number = 0
          that.toggleTimer()

          setTimeout(function() {
            that.scrollToBottom()
          }, 200)
          that.timer = setInterval(function() {
            if (that.currentRoom.api_data.length > that.question_number) {
              that.question_number++
              that.time = 0
            }
          }, ms)
        }
      } else {
        setTimeout(function() {
          that.proccessQuestions()
        }, 100)
      }
    },

    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.interval)
        console.log('timer stops')
      } else {
        this.interval = setInterval(this.incrementTime, 1000)
      }
      this.isRunning = !this.isRunning
    },
    incrementTime() {
      this.time = parseInt(this.time) + 1
    },

    selectAnswer(index, answer) {
      if (this.currentRoom.api_data[index].correct_answer === answer) {
        this.$notify({
          group: 'foo',
          text: `Correct answer.`,
          type: 'success'
        })
        this.addPoints(index, answer)
      } else {
        this.$notify({
          group: 'foo',
          text: `Wrong answer. Correct answer was ${
            this.currentRoom.api_data[index].correct_answer
          }`,
          type: 'error'
        })
        this.addPoints(index, false)
      }
      this.question_number++
      if (this.question_number == this.currentRoom.api_data.length) {
        this.$store.dispatch('room/finishGame', {
          code: this.$route.params.code
        })
      }
      this.restartQuestionTimer()
    },
    addPoints(index, correct) {
      let points = 100
      let percentage = this.time / this.currentRoom.time_per_questions
      if (percentage < 0.33) {
        points = points + 100
      } else if (percentage > 0.33 && percentage < 0.66) {
        points = points + 50
      }
      if (!correct) {
        points = 0
      } else {
        this.corrects++
      }
      this.$store.dispatch('room/addPoints', {
        code: this.$route.params.code,
        points: points,
        corrects: this.corrects,
        question: this.question_number
      })
    },
    restartQuestionTimer() {
      let that = this
      clearInterval(this.timer)
      let ms = that.currentRoom.time_per_questions * 1000
      that.time = 0
      this.timer = setInterval(function() {
        if (that.currentRoom.api_data.length > that.question_number) {
          that.question_number++
          that.time = 0
        }
      }, ms)
    },
    splitJoin(theText) {
      return theText.split(',')
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
.gameRoom {
  .card {
    .btn {
      width: 100%;
      float: left;
      margin: 0 0 15px;
    }
  }
  .user-list li div {
    padding-top: 5px;
  }
}
.user-list {
  list-style: none;
  float: left;
  width: 100%;
  margin: 0;
  padding: 0;
  .btn {
    float: right;
    margin: -19px 0 0;
  }
  li {
    margin-bottom: 10px;
    display: block;
    float: left;
    width: 100%;
    div {
      padding-top: 1em;
    }
  }
  img {
    box-shadow: 0 1px 20px 0 rgba(46, 61, 73, 0.2);
    border-radius: 50%;
    display: block;
    float: left;
    max-width: 50px;
    margin: 0 1em 0 0;
  }
}
</style>
