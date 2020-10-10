import Vue from 'vue'
import Vuex from 'vuex'
import OrderApi from '../api/OrderApi'

Vue.use(Vuex)

export default {
  state: {
    listOrders: [],
    orderDetail: {},
    listProductOfOrder: [],
  },
  getters: {
    listOrders (state) {
      return state.listOrders
    },
    orderDetail (state) {
      return state.orderDetail
    },
    listProductOfOrder (state) {
      return state.listProductOfOrder
    },
  },
  mutations: {
    setListOrders (state, listOrders) {
      state.listOrders = listOrders
    },
    setOrderDetail (state, orderDetail) {
      state.orderDetail = orderDetail
    },
    setListProductOfOrder (state, listProductOfOrder) {
      state.listProductOfOrder = listProductOfOrder
    },
  },
  actions: {
    fetchListOrders (context) {
      return OrderApi.getList()
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(data => {
                console.log('dataaaa ', data.data)
                context.commit('setListOrders', data.data)
              })
          }
          return response.status
        })
    },
    fetchDetail (context, orderId) {
      return OrderApi.getDetail(orderId)
        .then(response => {
          if (response.status === 200) {
            response.json()
              .then(data => {
                console.log('dataaaa ', data)

                var listProduct = []
                var total = 0
                var discount = 0

                for (var i = 0; i < data.orderDetails.length; i++) {
                  if (data.orderDetails[i] && data.orderDetails[i].product) {
                    var product = JSON.parse(data.orderDetails[i].product)
                    product.quantity = data.orderDetails[i].quantity
                    product.Discount = product.Discount * 100
                    listProduct.push(product)

                    total += product.Price * product.quantity
                    discount += Math.round(((product.Discount / 100 * product.Price) * product.quantity) * 100) / 100
                  }
                }

                data.totalPrice = total
                data.totalDiscount = discount
                data.totalFinal = total - discount

                context.commit('setOrderDetail', data)
                context.commit('setListProductOfOrder', listProduct)
              })
          }
          return response.status
        })
    },
    updateStatus (context, { status, orderId }) {
      console.log(status)
      return OrderApi.updateStatus(orderId, status)
        .then(response => {
          if (response.status === 200) {
            context.state.orderDetail.status = status
          }
          return response.status
        })
    },
  },
  namespaced: true,
}
