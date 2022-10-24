import request from '../utils/request'
import qs from 'qs'

export function operateCollect(param: any) {
    return request({
      url: '/collect/operateCollect',
      method: 'post',
      data: param
    })
  }