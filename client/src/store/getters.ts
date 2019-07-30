import { GetterTree } from 'vuex'

const getters: GetterTree<any, any> = {
  user(state: any): any {
    return state.user
  }
}

export default getters