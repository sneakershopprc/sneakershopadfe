// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import firebase from 'firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  i18n,
  created () {
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    var firebaseConfig = {
      apiKey: 'AIzaSyDtHltT6LmKMEbiqg8dhKjiVmaf9nPqRcg',
      authDomain: 'sneakershop-542c6.firebaseapp.com',
      databaseURL: 'https://sneakershop-542c6.firebaseio.com',
      projectId: 'sneakershop-542c6',
      storageBucket: 'sneakershop-542c6.appspot.com',
      messagingSenderId: '757963672417',
      appId: '1:757963672417:web:e1de75f73e2ab36a5e1320',
      measurementId: 'G-0YS60LQ0BJ',
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)
    firebase.analytics()
  },
  render: h => h(App),
}).$mount('#app')
