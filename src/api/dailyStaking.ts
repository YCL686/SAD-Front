import request from '../utils/request'
import qs from 'qs'

export function getDailyStakingPool(param: any) {
    return request({
        url: '/daily-staking-pool/getDailyStakingPool?' + qs.stringify(param),
        method: 'get'
    })
}

export function stakeDailyStaking(param: any) {
    return request({
        url: '/daily-staking-record/stakeDailyStaking',
        method: 'post',
        data: param
    })
}