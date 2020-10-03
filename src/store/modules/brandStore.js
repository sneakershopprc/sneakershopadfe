import Vue from 'vue'
import Vuex from 'vuex'
import BrandApi from '../api/BrandApi'

Vue.use(Vuex)

export default {
  state: {
    listBrands: [],
    brand: {
      brandId: '',
      brandNm: '',
      photo: '',
      description: '',
    },
  },
  getters: {
    listBrands (state) {
      return state.listBrands
    },
  },
  mutations: {
    setBrand (state, brand) {
      state.brand = brand
    },
    setListBrand (state, list) {
      state.listBrands = list
    },
  },
  actions: {
    fetchListBrands (context) {
      return BrandApi.getList()
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(data => {
                context.commit('setListBrand', data)
              })
          }
          return response.status
        })
    },
  },
  namespaced: true,
}
