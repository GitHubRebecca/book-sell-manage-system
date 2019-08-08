import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState({ //使用vuex-persistedstate持久化vuex中的数据
    storage: window.localStorage,
    reducer(val) {
      return {
        user: val.user,
        routes: val.routes
      }
    }
  })]
})
