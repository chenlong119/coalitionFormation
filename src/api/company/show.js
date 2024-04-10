import request from '@/utils/request'

// 查询企业信息列表
export function listShow(query) {
    return request({
        url: '/company/show/list',
        method: 'get',
        params: query
    })
}

// 查询企业信息详细
export function getShow(id, layerId) {
    return request({
        url: '/company/show/' + id + '/' + layerId,
        method: 'get'
    })
}

// 新增企业信息
export function addShow(data) {
    return request({
        url: '/company/show',
        method: 'post',
        data: data
    })
}

// 修改企业信息
export function updateShow(data) {
    return request({
        url: '/company/show',
        method: 'put',
        data: data
    })
}

// 删除企业信息
export function delShow(id) {
    return request({
        url: '/company/show/' + id,
        method: 'delete'
    })
}
