/**
 * [store entry]
 * 
 */
import { createStore, createLogger } from 'vuex'

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

// 引入 module 模块
const modules = {}
const modulesFile = import.meta.globEager('./modules/*.js');
for (const key in modulesFile) {
  const moduleKey = key.replace(/^\.\/modules\/(.*)\.js$/,'$1')
  modules[moduleKey] = modulesFile[key].default
}

const store = createStore({
  getters,
  actions,
  mutations,
  modules,
  // plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : []
})

export default store