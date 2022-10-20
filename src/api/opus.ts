import request from '../utils/request'
import qs from 'qs'
export function pageOpusList(param: any) {
  return request({
    url: '/opus/pageOpusList?' + qs.stringify(param),
    method: 'get',
    data:{}
  })
}

export function publish(param: any) {
  return request({
    url: '/opus/saveOrUpdateOpus',
    method: 'post',
    data: param
  })
}

export function getOpusById(param: any){
  return request({
    url: '/opus/getOpusById?' + qs.stringify(param),
    method:'get'
  })
}
