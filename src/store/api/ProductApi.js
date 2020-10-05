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

  /* updateBrand (brand) {
    const url = API_BASE + '/brands/' + brand.brandId

    return fetch(url, {
      method: 'PUT',
      crossDomain: true,
      body: JSON.stringify(brand),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  add (brand) {
    const url = API_BASE + '/brands'

    return fetch(url, {
      method: 'POST',
      crossDomain: true,
      body: JSON.stringify(brand),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } */
}

export default new BrandApi()
