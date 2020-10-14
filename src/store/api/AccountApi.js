import Helper from './BaseApi'

class AccountApi {
  getProfile () {
    var url = Helper.API_BASE + '/accounts/profile'

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }
}

export default new AccountApi()
