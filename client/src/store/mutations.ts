import { MutationTree } from 'vuex'

const mutations: MutationTree<any> = {
  SET_USER(state: any, payload: any): void {
    state.user = payload
  }
}

export default mutations