import request from '../utils/request'
import qs from 'qs'

export function getAdList() {
    return request({
      url: '/ad/getAdList',
      method: 'get'
    })
  }

  export function getMyAdList() {
    return request({
      url: '/ad/getMyAdList',
      method: 'get'
    })
  }

  export function editMyAd(param: any) {
    return request({
      url: '/ad/editMyAd',
      method: 'post',
      data: param
    })
  }