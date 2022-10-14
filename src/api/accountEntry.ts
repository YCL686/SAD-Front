import request from '../utils/request'
import qs from 'qs'

export function pageAccountEntry(data: any) {
    return request({
        url: '/account-entry/pageAccountEntry?' + qs.stringify(data),
        method: 'get'
    })
}