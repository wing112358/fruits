<template>
  <div id="app">
    <h1></h1>
<!--    <router-link to="/Login">登录</router-link>-->

    <router-view></router-view>
  </div>
</template>

<script>
import HelloWorld from './views/Login'

export default {
  name: 'App',

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>
