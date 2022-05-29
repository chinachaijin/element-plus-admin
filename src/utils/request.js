import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建AXIOS实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // 跨域请求时发送cookie
  timeout: 8000 // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做点什么

    if (store.getters.token) {
      // 让每个请求携带令牌
      // ['X-Token'] 是自定义头密钥
      // 请根据实际情况进行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 用于调试
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果要获取HTTP信息，如头或状态
   * 请返回  response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这只是一个例子
   * 您还可以通过HTTP状态代码判断状态
   */
  response => {
    const res = response.data
  
    // 如果自定义代码不是200，则判断为错误。
    if (res.code !== 200 && res.code !== 300) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法令牌；50012:其他登录客户端；50014:令牌过期；
      if (res.code === 205 || res.code === 50012 || res.code === 50014) {
        // 重新登录
        ElMessageBox.confirm('您已注销，可以取消以留在此页，或重新登录。', '确认注销', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // 用于调试
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
