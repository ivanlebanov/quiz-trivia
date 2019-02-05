<template lang="html">
  <nav class="navigation">
    <div class="row">
      <div class="col-md-5">
        <router-link :to="{ name: 'Home'}" class="logo">
          <img src="../assets/logo.png" alt="organization logo">
        </router-link>
      </div>
        <div class="col-md-7">

      </div>
    </div>
  </nav>
</template>

<script>
import {
  mapGetters
} from "vuex";
import axios from 'axios';
export default {
  data(){
      return {
        isActiveMenu: false,
        isActiveInviteMenu: false,
        term: '',
        suggestions: [],
        delay: 500
      }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style lang="scss">

  @-webkit-keyframes fadeInDown {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, -100%, 0);
      transform: translate3d(0, -100%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      -webkit-transform: translate3d(0, -50%, 0);
      transform: translate3d(0, -50%, 0);
    }

    to {
      opacity: 1;
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }
  }

  .fadeInDown {
    -webkit-animation-name: fadeInDown;
    animation-name: fadeInDown;
  }

  .remaining-div{
    width: calc(100% - 120px);
    float: left;
    padding-top: 5px;
    padding-left: 5px;
    position: relative;
    input[type="text"]{
      padding: 8px 10px 8px;
      top: 0;
      &:focus{
        top: 0;
      }
    }
  }
  .invites{
    background: #e23e57;
    position: absolute;
    right: -12px;
    top: -8px;
    width: 25px;
    height: 25px;
    color: #fff;
    border-radius: 50%;
    font-size: 70%;
    text-align: center;
    padding-top: 6px;

  }

  .navigation{
    float: left;
    width: 100%;
    background: #fff;
    box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
    padding: 5px 15px;
    .logo{
      max-width: 120px;
      img{
        max-height: 50px;
        width: auto;
      }
    }
    li{
      float: left;
      display: block;
      margin-left: 5px;
      position: relative;
    }
    a{
      // color: #fff;
      float: left;
      display: block;
      width: 100%;
    }
    .avatar{
      float: left;
      display: block;
      max-height: 35px;
      margin-right: 10px;
      border-radius: 50%;
      margin-top: 0;
    }
    h1{
      float: left;
      margin: 0;
      padding: 0;
    }
    ul{
      float: right;
      margin: 10px 0 0;
      padding: 0;
      list-style: none;
      li{
        position: relative;
        svg{
          margin-top: 5px;
        }
        span.name{
          margin-top: 10px;
          display: block;
          float: left;
        }
      }
      &.submenu{
        position: absolute;
        top: 47px;
        right: 8px;
        color: #000;
        display: none;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0 1px 20px 0 rgba(46,61,73,.2);
        -webkit-animation-duration: .5s;
        animation-duration: .5s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        animation-name: fadeInDown;
        &.invites-list{
          min-width: 350px;
          float: left;
          text-align: left;
          width: 100%;
          z-index: 99;
          font-size: 80%;
          .text{
            margin-top: 8px;
            margin-left: 5px;
            display: block;
            float: left;
          }
          li{
            padding: 10px 10px;
            float: none;
            display: block;
            width: 100%;
            overflow: hidden;
          }
        }
        li {
          width: 100%;
        }
        a{
          float: left;
          display: block;
          width: 100%;
          padding: 10px 30px 10px 10px;
        }
        &.active{
          display: block;
        }
      }
    }
    & > ul{
      span{
        display: block;
        padding-top: 7px;
        float: left;
      }

    }
  }
  .suggestions {
  float: left;
  width: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  background: white;
  top: 40px;
  border-radius: 4px;
  box-shadow: 0 1px 20px 0 rgba(46, 61, 73, 0.2);
  max-height: 400px;
  overflow: auto;
  z-index: 9;
  li {
    width: 100%;
    float: left;
    display: block;
    padding: 5px;
    cursor: pointer;
    position: relative;
    margin: 0;
    &:hover {
      background: #efefef;
    }
  }
  span {
    display: block;
    float: left;
    margin: 10px;
  }
}
</style>
