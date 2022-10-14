import request from '../utils/request'
import qs from 'qs'

export function getAccount() {
  return request({
    url: '/account/getAccount',
    method: 'get'
  })
}

export function deposit(data : any){
    return request({
        url:'account/deposit',
        method:'post',
        data
    })
}