import request from '../utils/request'
import qs from 'qs'

export function pageCommentList(data: any) {
    return request({
        url: '/comment/pageCommentList?' + qs.stringify(data),
        method: 'get'
    })
}

export function showAllCommentList(data: any) {
    return request({
        url: '/comment/showAllCommentList?' + qs.stringify(data),
        method: 'get'
    })

}

export function addComment(data: any) {
    return request({
        url: '/comment/addComment',
        method: 'post',
        data
    })
}