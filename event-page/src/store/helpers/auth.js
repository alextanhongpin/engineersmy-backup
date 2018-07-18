export default {
  checkAuth () {
    // We do a naive way of checking if the user is authorized or not
    const hasAccessToken = window.localStorage.getItem('access_token')
    const hasIdToken = window.localStorage.getItem('id_token')
    const hasExpiresIn = window.localStorage.getItem('expires_in')
    return !!(hasAccessToken && hasIdToken && hasExpiresIn)
  },
  userInfo () {
    const userByte = window.localStorage.getItem('user')
    const user = window.atob(userByte)
    try {
      return JSON.parse(user)
    } catch (error) {
      return {}
    }
  }
}
