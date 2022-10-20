import request from '../utils/request'
import qs from 'qs'

export function operateFocus(param: any) {
    return request({
      url: '/focus/operateFocus',
      method: 'post',
      data: param
    })
  }