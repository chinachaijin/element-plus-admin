import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
    return request({
      url: '/admins/info',
      method: 'get',
      params: { token }
    })
  }
  
export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    })
}
  
export function getcaptcha() {
    return request({
        url: '/login/captcha',
        method: 'get',
        params: Math.ceil(Math.random()*1000)
    })
}

  