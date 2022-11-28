import request from '../utils/request'
import qs from 'qs'

export function getLaunchList() {
  return request({
    url: '/launch/getLaunchList',
    method: 'get'
  })
}