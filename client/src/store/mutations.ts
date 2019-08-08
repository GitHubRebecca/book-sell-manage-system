import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  SET_USER(state: any, payload: any): void {
    state.user = payload
  },
  
  CLEAR_USER(state: any): void {
    state.user = null,
    state.routes = null
  },

  SET_ROUTES(state: any, payload: any): void {
    state.routes = payload
  }
}

export default mutations