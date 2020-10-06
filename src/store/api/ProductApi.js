import API_BASE from './BaseApi'

class BrandApi {
  getList () {
    const url = API_BASE + '/products'

    var response = fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
    })

    return response
  }

  getById (id) {
    const url = API_BASE + '/products/' + id

    var response = fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
    })

    return response
  }

  updateDetail (detail) {
    const url = API_BASE + '/productdetails/' + detail.id

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(detail),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  addNewDetail (detail) {
    const url = API_BASE + '/productdetails'

    return fetch(url, {
      method: 'POST',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(detail),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  updateProduct (product) {
    const url = API_BASE + '/products/' + product.productId

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  insertProduct (product) {
    const url = API_BASE + '/products'

    return fetch(url, {
      method: 'POST',
      withCredentials: true,
      crossDomain: true,
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  deleteProduct (id) {
    const url = API_BASE + '/products/' + id

    return fetch(url, {
      method: 'DELETE',
      withCredentials: true,
      crossDomain: true,
    })
  }
}

export default new BrandApi()
