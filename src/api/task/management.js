import request from '@/utils/request'

// 查询系统任务管理列表
export function listManagement(query) {
  return request({
    url: '/task/management/list',
    method: 'get',
    params: query
  })
}

// 查询系统任务管理详细
export function getManagement(id) {
  return request({
    url: '/task/management/' + id,
    method: 'get'
  })
}

// 新增系统任务管理
export function addManagement(data) {
  return request({
    url: '/task/management',
    method: 'post',
    data: data
  })
}

// 修改系统任务管理
export function updateManagement(data) {
  return request({
    url: '/task/management',
    method: 'put',
    data: data
  })
}

// 删除系统任务管理
export function delManagement(id) {
  return request({
    url: '/task/management/' + id,
    method: 'delete'
  })
}
