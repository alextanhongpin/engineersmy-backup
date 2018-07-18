import auth0 from 'auth0-js'

import AUTH_CONFIG from '../config/auth0'

export default {
  namespaced: true,
  state: {
    email: '',
    password: '',
    IS_ENTER_KEY: 13,
    auth0: new auth0.WebAuth(AUTH_CONFIG),
    // Custom ui
    auth0Passwordless: new auth0.WebAuth(AUTH_CONFIG)
  },
  getters: {
    email (state) {
      return state.email
    },
    password (state) {
      return state.password
    }
  },
  mutations: {
    setEmail (state, value) {
      state.email = value
    },
    setPassword (state, value) {
      state.password = value
    },
    clearForm (state) {
      state.email = ''
      state.password = ''
    }
  },
  actions: {
    // Auth0
    onBeforeLoadLoginPage ({ state }) {
      state.auth0.authorize()
    },
    onMagicLink ({ state }) {
      state.auth0Passwordless.magiclink({
        callbackURL: AUTH_CONFIG.redirectUri
      }, (error, email) => {
        if (!error) {
          window.alert('A magic link has been sent to ' + email)
        }
      })
    },
    handlePasswordless ({ state, dispatch }) {
      state.auth0Passwordless.parseHash(window.location.hash, (err, result) => {
        if (err) {
          console.log(err)
        }
        if (result && result.accessToken && result.idToken) {
          dispatch('setSession', result)
          // go back to home router
        }
      })
    },
    handleAuthentication ({ state, dispatch }) {
      state.auth0.parseHash((err, result) => {
        if (err) {
          console.log(err)
          // redirect to home
          return
        }
        if (result && result.accessToken && result.idToken) {
          dispatch('setSession', result)
          // go back to home router
        }
      })
    },
    setSession ({ commit, state }, auth) {
      const expiresAt = JSON.stringify(auth.expiresIn * 1000 + new Date().getTime())
      window.localStorage.setItem('access_token', auth.accessToken)
      window.localStorage.setItem('id_token', auth.idToken)
      window.localStorage.setItem('expires_in', expiresAt)
      const { name, nickname, picture, email } = auth.idTokenPayload
      window.localStorage.setItem('user', window.btoa(JSON.stringify({
        name,
        nickname,
        picture,
        email
      })))
      commit('setAuthorized', null, { root: true })
      commit('setUserInfo', auth.idTokenPayload, { root: true })
      commit('setRoute', '/', { root: true })
    },
    logout ({ commit }) {
      // Clear access token and ID token from local storage
      window.localStorage.removeItem('access_token')
      window.localStorage.removeItem('id_token')
      window.localStorage.removeItem('expires_at')

      commit('logout', null, { root: true })
      commit('setRoute', '/home', { root: true })
      commit('sidebar/close', null, { root: true })
    },
    isAuthenticated () {
      // Check whether the current time is past the
      // access token's expiry time
      const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'))
      return new Date().getTime() < expiresAt
    },
    // End: auth0
    onChangeEmail ({ commit }, evt) {
      const email = evt.currentTarget.value
      commit('setEmail', email)
    },
    onChangePassword ({ commit }, evt) {
      const password = evt.currentTarget.value
      commit('setPassword', password)
    },
    onEnter ({ dispatch, state }, evt) {
      if (evt.keyCode === state.IS_ENTER_KEY) {
        dispatch('onSubmitLogin')
      }
    },
    onSubmitLogin ({ commit, state }, evt) {
      const isValidEmail = state.email === ''
      const isValidPassword = state.password === ''

      if (!(isValidEmail && isValidPassword)) {
        window.alert('The email or password you entered is incorrect')
        return
      }
      commit('clearForm')
      // Set authorized
      commit('setAuthorized', null, { root: true })
      // Set the route to home
      commit('setRoute', '/', { root: true })
    }
  }
}
