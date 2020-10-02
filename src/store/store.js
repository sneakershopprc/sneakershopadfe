import Vue from 'vue'
import Vuex from 'vuex'

import templateStore from './modules/templateStore'
import loginStore from './modules/loginStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    templateStore,
    loginStore,
  },
})
