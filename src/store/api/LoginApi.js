import API_BASE from './BaseApi'

class LoginApi {
  login (user) {
    const url = API_BASE + '/login'

    var response = fetch(url, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      crossDomain: true,
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return response
  }
}

export default new LoginApi()
