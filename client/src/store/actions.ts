import { ActionTree } from 'vuex'
import JwtDecode from 'jwt-decode'
import {getPermissionRoutes} from '@/utils/routePermission'

const actions: ActionTree<any, any> = {
  async setUser({ commit, state }, payload: any) { 
    const user: any = JwtDecode(payload)
    commit("SET_USER", user)
    //设置路由
    const routes: any[] = getPermissionRoutes(undefined, user.indentity)
    commit("SET_ROUTES", routes)
  },
  async clearUser({ commit, state }) { 
    commit("CLEAR_USER")
  }
}

export default actions