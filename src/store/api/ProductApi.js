import Helper from './BaseApi'

class BrandApi {
  getList () {
    const url = Helper.API_BASE + '/products'

    var response = fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })

    return response
  }

  getById (id) {
    const url = Helper.API_BASE + '/products/' + id

    var response = fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })

    return response
  }

  updateDetail (detail) {
    const url = Helper.API_BASE + '/productdetails/' + detail.id

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(detail),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  addNewDetail (detail) {
    const url = Helper.API_BASE + '/productdetails'

    return fetch(url, {
      method: 'POST',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(detail),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  updateProduct (product) {
    const url = Helper.API_BASE + '/products/' + product.productId

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  insertProduct (product) {
    const url = Helper.API_BASE + '/products'

    return fetch(url, {
      method: 'POST',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  deleteProduct (id) {
    const url = Helper.API_BASE + '/products/' + id

    return fetch(url, {
      method: 'DELETE',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }
}

export default new BrandApi()
