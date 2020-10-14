import Vue from 'vue'
import Vuex from 'vuex'

import templateStore from './modules/templateStore'
import loginStore from './modules/loginStore'
import brandStore from './modules/brandStore'
import productStore from './modules/productStore'
import orderStore from './modules/orderStore'
import accountStore from './modules/accountStore'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    templateStore,
    loginStore,
    brandStore,
    productStore,
    orderStore,
    accountStore,
  },
})
