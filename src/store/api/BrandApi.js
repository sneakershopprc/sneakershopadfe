import Helper from './BaseApi'

class BrandApi {
  getList () {
    const url = Helper.API_BASE + '/brands'

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

  updateBrand (brand) {
    const url = Helper.API_BASE + '/brands/' + brand.brandId

    return fetch(url, {
      method: 'PUT',
      crossDomain: true,
      body: JSON.stringify(brand),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  add (brand) {
    const url = Helper.API_BASE + '/brands'

    return fetch(url, {
      method: 'POST',
      crossDomain: true,
      body: JSON.stringify(brand),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  delete (brandId) {
    const url = Helper.API_BASE + '/brands/' + brandId

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
