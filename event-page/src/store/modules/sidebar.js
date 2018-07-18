export default {
  namespaced: true,
  state: {
    isOpen: false
  },
  getters: {
    isOpen (state) {
      return state.isOpen
    }
  },
  mutations: {
    toggle (state) {
      state.isOpen = !state.isOpen

      // Disable scroll
      document.body.style.overflow = state.isOpen ? 'hidden' : 'auto'
    },
    close (state) {
      state.isOpen = false

      // Enable scroll
      document.body.style.overflow = 'auto'
    }
  },
  actions: {
    toggle ({ commit }) {
      commit('toggle')
    },
    close ({ commit }) {
      commit('close')
    }
  }
}
