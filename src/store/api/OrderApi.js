import API_BASE from './BaseApi'

class OrderApi {
  getList () {
    const url = API_BASE + '/orders'

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
    })
  }

  getDetail (orderId) {
    const url = API_BASE + '/orders/' + orderId

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
    })
  }

  updateStatus (orderId, status) {
    const url = API_BASE + '/orders/' + orderId

    var stt = { status: status }

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(stt),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

export default new OrderApi()
