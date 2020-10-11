import Helper from './BaseApi'

class OrderApi {
  getList () {
    const url = Helper.API_BASE + '/orders'

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  getDetail (orderId) {
    const url = Helper.API_BASE + '/orders/' + orderId

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  updateStatus (orderId, status) {
    const url = Helper.API_BASE + '/orders/' + orderId

    var stt = { status: status }

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(stt),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }
}

export default new OrderApi()
