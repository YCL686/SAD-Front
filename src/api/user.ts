import request from '../utils/request'
import qs from 'qs'

export function login(data: any) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout(data: any) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}
