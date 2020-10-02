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
          return response.json()
        } else {
          return null
        }
      }).then(data => {
        if (data && data.role === 'admin') {
          context.commit('setUser', data)
          return true
        }
        return false
      })
    },
  },
  namespaced: true,
}
