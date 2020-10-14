import Vue from 'vue'
import Vuex from 'vuex'
import LoginApi from '../api/LoginApi'

Vue.use(Vuex)

export default {
  state: {
    user: {},
  },
  getters: {
    getUser (state) {
      return JSON.parse(localStorage.getItem('user'))
    },
  },
  mutations: {
    setUser (state, user) {
      if (user === null) {
        localStorage.removeItem('user')
        state.user = null
      } else {
        localStorage.setItem('user', JSON.stringify(user))
        state.user = user
      }
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

    logout (context) {
      context.commit('setUser', null)
    },
  },
  namespaced: true,
}
