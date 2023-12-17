import request from '@/utils/requestprd'

export function getLoginSmsCode(data) {
  return request({
    url: '/getLoginSmsCode',
    method: 'post',
    data
  })
}


export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}



export function logout(data) {
  return request({
    url: '/op/logout',
    method: 'post',
    data
  })
}
