import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    user: ""
  },
  mutations: {
    changeUserData(state, payload) {
      state.user = payload
    }
  },
  actions: {
    changeUserAction({
      commit
    }, {
      user
    }) {
      commit('changeUserData', user)
    }
  }
})

