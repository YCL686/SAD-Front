import request from '../utils/request'
import qs from 'qs'
export function pageOpusList(param: any) {
  return request({
    url: '/opus/pageOpusList?' + qs.stringify(param),
    method: 'get',
    data:{}
  })
}
