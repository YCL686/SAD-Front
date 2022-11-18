import request from '../utils/request'
import qs from 'qs'

export function getAdAuctionList() {
    return request({
      url: '/ad-auction/getAdAuctionList',
      method: 'get'
    })
  }

  export function getAdAuctionInfo() {
    return request({
      url: '/ad-auction/getAdAuctionInfo',
      method: 'get'
    })
  }