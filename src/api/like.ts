import request from '../utils/request'
import qs from 'qs'

export function operateLike(param: any) {
    return request({
      url: '/like/operateLike',
      method: 'post',
      data: param
    })
  }