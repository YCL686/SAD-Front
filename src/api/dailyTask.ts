import request from '../utils/request'
import qs from 'qs'

export function getDailyTask() {
    return request({
        url: '/daily-task-config/getDailyTask',
        method: 'get'
    })
}

export function getDailyTaskReward(param: any) {
    return request({
        url: '/daily-task-record/getDailyTaskReward',
        method: 'post',
        data: param
    })
}