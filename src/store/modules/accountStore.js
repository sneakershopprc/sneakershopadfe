import Vue from 'vue'
import Vuex from 'vuex'
import AccountApi from '../api/AccountApi'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    user: {},
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
  },
  actions: {
    fetchProfile (context) {
      return AccountApi.getProfile()
        .then(response => {
          var status = response.status
          if (status === 200) {
            return response.json()
              .then(data => {
                console.log('profile ', data)
                context.commit('setUser', data)
                return status
              })
          }
          return status
        })
    },
  },
}
