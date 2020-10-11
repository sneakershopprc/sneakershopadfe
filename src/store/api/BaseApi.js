class Helper {
  API_BASE = 'https://localhost:44303/api'

  getToken () {
    var user = JSON.parse(localStorage.getItem('user'))

    if (user) return user.token
    return null
  }
}

export default new Helper()
