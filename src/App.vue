<template>
  <router-view></router-view>
</template>

<script>
import { searchParse } from '@/utils/common'
import { useStore } from 'vuex';
export default {
  name: 'App',
  setup() {
    const store = useStore();
    const userInfo = searchParse();

    console.log('oa-login', userInfo);
    store.dispatch('setToken', userInfo.token)
    store.dispatch('setTeamId', userInfo.teamId)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
  color: #2c3e50;
  height: 100%;
}
</style>
