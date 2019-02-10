<template>
  <div id="app" class="bootstrap-wrapper">
    <Navigation v-if="user"/>
    <router-view />
    <notifications group="foo" position="top right" :duration="num"></notifications>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import {
  mapGetters
} from "vuex";
export default {
  name: 'App',
  metaInfo: {
    title: "",
    titleTemplate: "%s Quiz Trivia"
  },
  watch: {
    'user': function(newVal, oldVal) {
      if(newVal != null){
        this.$socket.emit('SET_SOCKET_USER', newVal._id)
        this.$store.dispatch("category/getCategories")
      }
    }
  },
  components: {
    Navigation
  },
  data() {
    return {
      num: 5000
    }
  },
  mounted(){
    this.$store.dispatch("user/getCurrentUser")
  },
  computed: {
    ...mapGetters("user", ["user", "id"]),
  }
}
</script>

<style lang="scss">
@import "../node_modules/normalize.css/normalize.css";
@import "../node_modules/bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css";

/* playfair-display-regular - latin */
/* latin-ext */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjxAwXiWtFCfQ7A.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXiWtFCc.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
html, body{
  font-display: swap;
}

*, *:before, *:after {
  box-sizing: inherit;
}
html {
  box-sizing: border-box;
}
*, *:before, *:after {
  box-sizing: inherit;
}

body .btn-rounded{
  border-radius: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  margin-right: 5px;
  &.btn-error{
    border-color: #e23e57;
    svg{
      fill: #e23e57;
    }
    &:hover{
      background: #e23e57;
      svg{
        fill: #fff;
      }
    }
  }
  &.btn-success{
    border-color: #1fab89;
    svg{
      fill: #1fab89;
    }
    &:hover{
      background: #1fab89;
      svg{
        fill: #fff;
      }
    }
  }

  svg{
    width: 16px;
    height: 16px;
    display: block;
    margin: 0 auto!important;
    float: none;
  }
}

#app {
  font-family: 'Archivo', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1, h2, h3, h4, h5, h6{
  font-family: "Lato", sans-serif;
  font-weight: 400;
}
input[type="text"], input[type="number"]{
  width: 100%;
  float: left;
  padding: 15px 10px;
  margin: 5px 0 15px;
  border: 0;
  border: 2px solid;
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
  box-shadow: 0;
  position: relative;
  display: block;
  top: 0;
  &:focus{
    box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
  }
  &:hover, &:focus{
    outline: none;

  }
}
.card{
  -webkit-box-flex: 1;
    -ms-flex: 1 1 100%;
    flex: 1 1 100%;
    margin: 15px;
    z-index: 499;
    z-index: calc(500 - 1);
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    border: none;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    overflow: hidden;
    padding: 25px 25px 25px;
    background-color: #fff;
    border-radius: 8px;
    -webkit-box-shadow: 0 13px 27px -5px rgba(50,50,93,0.25), 0 8px 16px -8px rgba(0,0,0,0.3);
    box-shadow: 0 13px 27px -5px rgba(50,50,93,0.25), 0 8px 16px -8px rgba(0,0,0,0.3);
    -webkit-transition-property: color,background-color,-webkit-box-shadow,-webkit-transform;
    transition-property: color,background-color,-webkit-box-shadow,-webkit-transform;
    transition-property: color,background-color,box-shadow,transform;
    transition-property: color,background-color,box-shadow,transform,-webkit-box-shadow,-webkit-transform;
    -webkit-transition-duration: .15s;
    transition-duration: .15s;
    color: #000;
    &:hover{
      webkit-box-shadow: 0 30px 60px -12px rgba(50,50,93,0.25),0 18px 36px -18px rgba(0,0,0,0.3);
      box-shadow: 0 30px 60px -12px rgba(50,50,93,0.25), 0 18px 36px -18px rgba(0,0,0,0.3);
    }
}
#app{
  min-height: 100vh;
  background: #2193b0;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #6dd5ed, #2193b0); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.center-vertical{
  width: 100%;
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  color: #fff;
}
.panel{
  background: #fff;
  box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
  float: left;
  width: 100%;
  padding: 20px 15px;
  border-radius: 4px;
  h1{
    margin-top: 0;
  }
}
.btn{
  float: left;
  display: block;
  color: #000;
  padding: 10px 15px;
  border-radius: 0;
  border: 2px solid #000;
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
  box-shadow: 0 1px 20px 0 rgba(46,61,73,.1);
  svg{
    float: left;
    display: block;
    margin-right: 5px;
    margin-top: 1px;
    fill: #000;
        width: 15px;
        height: 15px;
  }
  &:hover{
    color: #fff;
    background: #000;
    box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
    svg {
      fill: #fff;
    }
  }
}
a, a:hover, a:focus{
  text-decoration: none;
  color: #000;
}


section{
  float: left;
  width: 100%;
}

</style>
