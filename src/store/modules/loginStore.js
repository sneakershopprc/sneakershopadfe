import Vue from 'vue'
import Vuex from 'vuex'
import LoginApi from '../api/LoginApi'

Vue.use(Vuex)

export default {
  state: {
    user: {},
  },
  mutations: {
    setUser (state, user) {
      localStorage.setItem('user', JSON.stringify(user))
      state.user = user
    },
  },
  actions: {
    login (context, user) {
      return LoginApi.login(user)
      .then(response => {
        console.log(response)
        if (response.status === 200) {
          context.commit('setUser', user)
          return true
        } else {
          return false
        }
      })
    },
  },
  namespaced: true,
}
