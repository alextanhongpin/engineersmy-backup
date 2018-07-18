import Vuex from 'vuex'
import Vue from 'vue'

// Model-specific modules
import sidebar from './modules/sidebar'
import login from './modules/login'
import page from './modules/page'
import event from './modules/event.ts'
import home from './modules/home.ts'
import photo from './modules/photo.ts'

import auth from './helpers/auth'

import router from '../router'

Vue.use(Vuex)
const user = auth.userInfo()

const store = new Vuex.Store({
  modules: {
    sidebar,
    login,
    page,
    event,
    home,
    photo
  },
  state: {
    isAuthorized: auth.checkAuth(),
    isOnline: true,
    resizeTimeout: null,
    width: window.innerWidth,
    name: user.name,
    email: user.email,
    nickname: user.nickname,
    picture: user.picture
  },
  mutations: {
    setRoute (state, value) {
      router.push(value)
    },
    replaceRoute (state, value) {
      router.replace(value)
    },
    setAuthorized (state) {
      state.isAuthorized = true
    },
    setUserInfo (state, payload) {
      const { name, nickname, picture, email } = payload
      state.name = name
      state.nickname = nickname
      state.picture = picture
      state.email = email
    },
    logout (state) {
      state.isAuthorized = false
    },
    SET_FIELD (state, { key, value }) {
      state[key] = value
    }
  },
  getters: {
    isAuthorized (state) {
      return state.isAuthorized
    },
    isOnline (state) {
      return state.isOnline
    },
    width (state) {
      return state.width
    },
    name (state) {
      return state.name
    },
    email (state) {
      return state.email
    },
    nickname (state) {
      return state.nickname
    },
    picture (state) {
      return state.picture
    }
  },
  actions: {
    onOnline ({ commit }, value) {
      commit('SET_FIELD', {
        key: 'isOnline',
        value
      })
    },
    onWindowResize ({ commit, state }, evt) {
      if (state.resizeTimeout) {
        window.clearTimeout(state.resizeTimeout)
      }
      commit('SET_FIELD', {
        key: 'resizeTimeout',
        value: null
      })
      commit('SET_FIELD', {
        key: 'resizeTimeout',
        value: window.setTimeout(() => {
          commit('SET_FIELD', {
            key: 'width',
            value: window.innerWidth
          })
        }, 250)
      })
    }
  }
})

// The list of urls an unauthorized user can access
const whitelistedUrls = ['/login', '/callback', '/home', '/photos', '/developers']
// The list of urls an authorized user cannot access
const blacklistedUrls = ['/login', '/register', '/callback']
const defaultRoute = '/home'

// Manage the route to check if the user is authorized or not
router.beforeEach((to, from, next) => {
  // Fake slow timeout
  // window.setTimeout(() => {}, 5000)
  const isFromIndex = from.path === '/'
  const isToIndex = to.path === '/'
  const isUserAuthorized = store.state.isAuthorized

  // Prevent authorized user from accessing the login, register or callback page
  if (isUserAuthorized && blacklistedUrls.includes(to.path)) {
    return next(from.path)
  }
  if (!isUserAuthorized) {
    if (isFromIndex && isToIndex) {
      return next(defaultRoute)
    }
    if (whitelistedUrls.includes(to.path)) {
      return next()
    } else {
      return next(false)
    }
  }
  next()
})

export default store
