import request from '../utils/request'
import qs from 'qs'

export function login(data: any) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}

export function getProfile(param: any){
  return request({
    url: '/user/getProfile?'+qs.stringify(param),
    method: 'get'
  })
}
