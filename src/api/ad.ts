import request from '../utils/request'
import qs from 'qs'

export function getAdList() {
    return request({
      url: '/ad/getAdList',
      method: 'get'
    })
  }