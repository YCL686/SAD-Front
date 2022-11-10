import request from '../utils/request'
import qs from 'qs'

export function rewardMe(data: any) {
  return request({
    url: '/reward/rewardMe',
    method: 'post',
    data
  })
}

export function pageRewardRecord(data: any) {
    return request({
      url: '/reward/pageRewardRecord?'+qs.stringify(data),
      method: 'get',
    })
  }