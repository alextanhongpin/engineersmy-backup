export default {
  namespaced: true,
  state: {
    isLoading: false
  },
  getters: {
    isLoading (state) {
      return state.isLoading
    }
  },
  mutations: {
    SET_FIELD (state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    pageDidLoad ({ commit }) {
      commit('SET_FIELD', {
        key: 'isLoading',
        value: false
      })
    },
    pageOnLoad ({ commit }) {
      commit('SET_FIELD', {
        key: 'isLoading',
        value: true
      })
    }
  }
}
