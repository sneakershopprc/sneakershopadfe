import Vue from 'vue'
import Vuex from 'vuex'
import AccountApi from '../api/AccountApi'

Vue.use(Vuex)

export default {
  namespaced: true,
  state: {
    listAcc: [],
    user: {},
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setListAcc (state, list) {
      state.listAcc = list
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
                // console.log('profile ', data)
                context.commit('setUser', data)
                return status
              })
          }
          return status
        })
    },
    updateProfile (context) {
      return AccountApi.updateProfile(context.state.user)
        .then(response => {
          var status = response.status
          if (status === 200) {
            return response.json()
              .then(data => {
                // console.log('profile ', data)
                context.commit('setUser', data)

                var curStoreUser = localStorage.getItem('user')
                if (curStoreUser) {
                  curStoreUser = JSON.parse(curStoreUser)
                  curStoreUser.photo = data.photo
                  curStoreUser.fullname = data.fullname
                  curStoreUser.email = data.email

                  localStorage.setItem('user', JSON.stringify(curStoreUser))
                }

                return status
              })
          }
          return status
        })
    },
    fetchList (context) {
      return AccountApi.getList()
        .then(response => {
          if (response.status === 200) {
            return response.json()
              .then(data => {
                // console.log('list acc', data)
                context.commit('setListAcc', data)

                return response.status
              })
          }
          return response.status
        })
    },
    actionAcc (context, username) {
      return AccountApi.actionAcc(username)
        .then(response => {
          if (response.status === 200) {
            var current = context.state.listAcc.find(e => e.username === username)
            // console.log('acc ', current)
            current.delFlg = !current.delFlg
          }
          return response.status
        })
    },
  },
}
