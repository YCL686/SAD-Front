import request from '../utils/request'
import qs from 'qs'

export function getSynchronizeRecordList(data: any) {
  return request({
    url: '/synchronize-record/getSynchronizeRecordList?' + qs.stringify(data),
    method: 'get'
  })
}

export function getSynchronizeInfo() {
    return request({
      url: '/synchronize-record/getSynchronizeInfo',
      method: 'get',
    })
  }