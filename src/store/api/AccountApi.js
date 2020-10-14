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

  updateProfile (user) {
    var url = Helper.API_BASE + '/accounts'

    return fetch(url, {
      method: 'PUT',
      withCredentials: true,
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Helper.getToken(),
      },
      body: JSON.stringify(user),
    })
  }

  getList () {
    var url = Helper.API_BASE + '/accounts'

    return fetch(url, {
      method: 'GET',
      withCredentials: true,
      crossDomain: true,
      headers: {
        Authorization: 'Bearer ' + Helper.getToken(),
      },
    })
  }

  actionAcc (username) {
    var url = Helper.API_BASE + '/accounts/' + username

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

export default new AccountApi()
