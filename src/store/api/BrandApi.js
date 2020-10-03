import API_BASE from './BaseApi'

class BrandApi {
  getList () {
    const url = API_BASE + '/brands'

    var response = fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
    })

    return response
  }
}

export default new BrandApi()
