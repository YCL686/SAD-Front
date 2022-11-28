import request from '../utils/request'
import qs from 'qs'

export function addLaunch(param: any) {
    return request({
      url: '/launch-record/addLaunch',
      method: 'post',
      data: param
    })
  }