import { routes } from '@/router'

export function getPermissionRoutes(allRoutes: Array<any> = routes, role: string): any {
  return allRoutes.filter(route => { //filter方法 返回为true的元素组成的数组
    if (hasPermission(route, role)) {
      if (route.children && route.children.length > 0) {
        route.children = getPermissionRoutes(route.children, role)
      }
      return true
    } else {
      return false
    }
  })
}

function hasPermission(route: any, role: string): any {
  //如果设置有权限 就过滤权限
  if (route.meta && route.meta.roles) {
    return route.meta.roles.some((routeRole: string) => { //some方法 有一个为true就返回true
      return routeRole == role
    })
  }
  //没有设置权限的就是都有权限访问
  return true
}