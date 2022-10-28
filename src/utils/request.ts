import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '../store/index'
import {
  useBoard,
  useEthers,
  useWallet,
} from 'vue-dapp'


const { open } = useBoard()
const { isActivated } = useEthers()

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000, // 请求超时时间毫秒
  withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    'Content-Type': 'application/json',
    'token': '',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.token = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {

    const res = response.data
    if (res.code == 1 || res.code == -1) { //业务错误或者未知错误
      ElMessage({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else if (res.code == 2) { //token有误
      store.dispatch('setIsLogined', false)
      debugger
      isActivated.value = false;
      localStorage.removeItem("token")
      open()
      ElMessage({
        message: 'Please Connect Your Wallet',
        type: 'warning',
        duration: 5 * 1000
      })
    } else if (res.code == 0) {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default instance
