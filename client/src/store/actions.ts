import { ActionTree } from 'vuex'
import JwtDecode from 'jwt-decode'

const actions: ActionTree<any, any> = {
  async setUser({ commit, state }, payload: any) { 
    const user = JwtDecode(payload)
    commit("SET_USER", user)
  }
}

export default actions