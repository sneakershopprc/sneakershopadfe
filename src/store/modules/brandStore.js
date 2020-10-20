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
                // console.log('dataaaa ', data)
                context.commit('setListBrand', data.data)
              })
          }
          return response.status
        })
    },

    updateBrand (context) {
      return BrandApi.updateBrand(context.state.brand)
        .then(response => {
          return response.status
        })
    },

    addBrand (context) {
      return BrandApi.add(context.state.brand)
        .then(response => {
          return response.status
        })
    },

    deleteBrand (context, brandId) {
      return BrandApi.delete(brandId)
        .then(response => response.status)
    },
  },
  namespaced: true,
}
