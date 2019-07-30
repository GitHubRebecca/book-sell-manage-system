//需要安装axios @types/axios
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Message } from 'element-ui'
import router from "@/router"

//创建axios实例
const http = axios.create({
  timeout: 5000
})

http.interceptors.request.use((config: AxiosRequestConfig) => {
  if (localStorage.getItem("bsToken")) {
    config.headers.Authorization = localStorage.getItem("bsToken")
  }

  return config
}, (err: any) => {
  return Promise.reject(err)
})

http.interceptors.response.use((response: AxiosResponse) => {

  return response
}, (err: any) => {
  let errMsg = ''
  if (err && err.response.status) {
    switch (err.response.status) {
      case 401:
        errMsg = '登录状态失效，请重新登录';
        localStorage.removeItem('bsToken');
        router.push('/login');
        break;
      case 403:
        errMsg = '拒绝访问';
        break;

      case 408:
        errMsg = '请求超时';
        break;

      case 500:
        errMsg = '服务器内部错误';
        break;

      case 501:
        errMsg = '服务未实现';
        break;

      case 502:
        errMsg = '网关错误';
        break;

      case 503:
        errMsg = '服务不可用';
        break;

      case 504:
        errMsg = '网关超时';
        break;

      case 505:
        errMsg = 'HTTP版本不受支持';
        break;

      default:
        errMsg = err.response.data.msg;
        break;
    }
    Message({
      type: 'error',
      message: errMsg
    })
    return Promise.reject(err.response)
  }
})

export default http