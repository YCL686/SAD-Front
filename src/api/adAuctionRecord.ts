import request from '../utils/request'
import qs from 'qs'

export function pageBidRecord(data: any) {
    return request({
      url: '/ad-auction-record/pageBidRecord?' + qs.stringify(data),
      method: 'get'
    })
  }

  export function bidBuy(data: any) {
    return request({
      url: '/ad-auction-record/bidBuy',
      method: 'post', 
      data: data
    })
  }