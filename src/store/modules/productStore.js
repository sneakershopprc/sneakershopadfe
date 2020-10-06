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
    listPhoto: [],
    listDetail: [],
  },
  getters: {
    listProducts (state) {
      return state.listProducts
    },
    product (state) {
      return state.product
    },
    listPhoto (state) {
      return state.listPhoto
    },
    listDetail (state) {
      return state.listDetail
    },
  },
  mutations: {
    setProduct (state, product) {
      state.product = product
    },
    setListProduct (state, list) {
      state.listProducts = list
    },
    setListPhoto (state, listPhoto) {
      state.listPhoto = listPhoto
    },
    setListDetail (state, listDetail) {
      state.listDetail = listDetail
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
                if (data.discount) {
                  data.discount = data.discount * 100
                }
                context.commit('setProduct', data)

                var tmpLst = []
                if (data.photoList) {
                  data.photoList.map(photoUrl => {
                    tmpLst.push({ url: photoUrl })
                  })

                  context.commit('setListPhoto', tmpLst)
                  console.log('listphotooo ', context.state.listPhoto)
                }

                if (data.productDetailList) {
                  tmpLst = []
                  data.productDetailList.map(detail => {
                    tmpLst.push({
                      ...detail,
                      origin: true,
                    })
                  })
                  context.commit('setListDetail', tmpLst.sort((a, b) => a.size - b.size))
                }
              })
          }
          return response.status
        })
    },

    updateDetail (context) {
      for (let i = 0; i < context.state.listDetail.length; i++) {
        var detail = context.state.listDetail[i]
        console.log('detaillllllll ', detail)
        if (detail.origin) {
          var current = context.state.product.productDetailList.find(e => e.id === detail.id)

          if (current) {
            if (current.quantity !== detail.quantity || current.size !== detail.size || current.price !== detail.price) {
              ProductApi.updateDetail(detail)
            }
          }
        } else {
          if (detail.quantity !== 0 && detail.size !== 0 && detail.price !== 0) {
            detail.productId = context.state.product.productId
            ProductApi.addNewDetail(detail)
          }
        }
      }
    },

    updateProduct (context) {
      context.state.product.photoList = []
      context.state.listPhoto.map(photo => {
        context.state.product.photoList.push(photo.url)
      })
      var product = Object.assign({}, context.state.product)
      product.discount = product.discount / 100

      return ProductApi.updateProduct(product)
        .then(response => {
          return response.status
        })
    },

    insertDetail (context) {
      for (let i = 0; i < context.state.listDetail.length; i++) {
        var detail = context.state.listDetail[i]
        console.log('detaillllllll ', detail)
        if (detail.quantity !== 0 && detail.size !== 0 && detail.price !== 0) {
          detail.productId = context.state.product.productId
          ProductApi.addNewDetail(detail)
        }
      }
    },

    insertProduct (context) {
      context.state.product.photoList = []
      context.state.listPhoto.map(photo => {
        context.state.product.photoList.push(photo.url)
      })

      var product = Object.assign({}, context.state.product)
      product.discount = product.discount / 100

      return ProductApi.insertProduct(product)
        .then(response => {
          if (response.status === 201) {
            return response.json()
              .then(data => {
                context.state.product.productId = data.productId
                console.log('productId ', context.state.product.productId)
              }).then(() => response.status)
          }
          return response.status
        })
    },

    deleteProduct (context, id) {
      return ProductApi.deleteProduct(id)
        .then(response => response.status)
    },

    reset (context) {
      context.state.product = {
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
      }
      context.state.listPhoto = []
      context.state.listDetail = []
    },
  },
  namespaced: true,
}
