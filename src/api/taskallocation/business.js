import request from '@/utils/request'

// 查询企业信息列表
export function listBusiness(query) {
  return request({
    url: '/taskallocation/business/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getBusiness(id) {
  return request({
    url: '/taskallocation/business/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addBusiness(data) {
  return request({
    url: '/taskallocation/business',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateBusiness(data) {
  return request({
    url: '/taskallocation/business',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delBusiness(id) {
  return request({
    url: '/taskallocation/business/' + id,
    method: 'delete'
  })
}
