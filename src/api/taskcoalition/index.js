import request from '@/utils/request'

// 查询任务信息列表
export function listFormation(query) {
    return request({
        url: '/coalition/formation/list',
        method: 'get',
        params: query
    })
}

// 查询任务信息详细
export function getFormation(id) {
    return request({
        url: '/coalition/formation/' + id,
        method: 'get'
    })
}

// 新增任务信息
export function addFormation(data) {
    return request({
        url: '/coalition/formation',
        method: 'post',
        data: data
    })
}

// 修改任务信息
export function updateFormation(data) {
    return request({
        url: '/coalition/formation',
        method: 'put',
        data: data
    })
}

// 删除任务信息
export function delFormation(id) {
    return request({
        url: '/coalition/formation/' + id,
        method: 'delete'
    })
}
