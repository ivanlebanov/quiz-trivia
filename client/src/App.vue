<template>
  <div id="app" class="bootstrap-wrapper">
    <Navigation />
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
    //this.$store.dispatch("user/getUser")
  },
  computed: {
    //...mapGetters("user", ["user", "id"]),
  }
}
</script>

<style lang="scss">
@import "../node_modules/normalize.css/normalize.css";
@import "../node_modules/bootstrap-grid-only-css/dist/css/bootstrap-grid.min.css";

/* playfair-display-regular - latin */
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 400;
  src: url('../fonts/playfair-display-v13-latin-regular.eot'); /* IE9 Compat Modes */
  src: local('Playfair Display Regular'), local('PlayfairDisplay-Regular'),
       url('../fonts/playfair-display-v13-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../fonts/playfair-display-v13-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('../fonts/playfair-display-v13-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('../fonts/playfair-display-v13-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../fonts/playfair-display-v13-latin-regular.svg#PlayfairDisplay') format('svg'); /* Legacy iOS */
}
/* archivo-regular - latin */
@font-face {
  font-family: 'Archivo';
  font-style: normal;
  font-weight: 400;
  src: url('../fonts/archivo-v3-latin-regular.eot'); /* IE9 Compat Modes */
  src: local('Archivo Regular'), local('Archivo-Regular'),
       url('../fonts/archivo-v3-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('../fonts/archivo-v3-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
       url('../fonts/archivo-v3-latin-regular.woff') format('woff'), /* Modern Browsers */
       url('../fonts/archivo-v3-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
       url('../fonts/archivo-v3-latin-regular.svg#Archivo') format('svg'); /* Legacy iOS */
}
html, body{
  font-display: swap;
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
  font-family: "Playfair Display", sans-serif;
  font-weight: 400;
}
input[type="text"], input[type="number"]{
  width: 100%;
  float: left;
  padding: 15px 10px;
  margin: 0 0 15px;
  border: 0;
  border: 2px solid;
  -webkit-transition: all .3s ease-in-out;
  -moz-transition: all .3s ease-in-out;
  -o-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
  box-shadow: 0;
  position: relative;
  top: 0;
  &:focus{
    border-color: #00adb5;
    top: -5px;
    box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
  }
  &:hover, &:focus{
    outline: none;

  }
}
.center-vertical{
  width: 100%;
  position: absolute;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
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
