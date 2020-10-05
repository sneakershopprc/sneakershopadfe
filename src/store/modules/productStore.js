import Vue from 'vue'
import Vuex from 'vuex'
import ProductApi from '../api/ProductApi'

Vue.use(Vuex)

export default {
  state: {
    listProducts: [],
    product: {
      productId: '',
      productNm: '',
      color: '',
      description: '',
      price: 0,
      discount: 0,
      brandId: '',
      brandNm: '',
      photoList: [],
      productDetailList: [],
    },
  },
  getters: {
    listProducts (state) {
      return state.listProducts
    },
    product (state) {
      return state.product
    },
  },
  mutations: {
    setProduct (state, product) {
      state.product = product
    },
    setListProduct (state, list) {
      state.listProducts = list
    },
  },
  actions: {
    fetchListProducts (context) {
      return ProductApi.getList()
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(data => {
                console.log('dataaaa ', data.data)
                context.commit('setListProduct', data.data)
              })
          }
          return response.status
        })
    },

    fetchProduct (context, id) {
      return ProductApi.getById(id)
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(data => {
                console.log('producttttt ', data)
                context.commit('setProduct', data)
              })
          }
        })
    },

    /* updateBrand (context) {
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
    }, */
  },
  namespaced: true,
}
