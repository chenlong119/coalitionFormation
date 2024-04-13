import request from '@/utils/request'

// 获取全部企业信息（id,name）
export function getAllCompany() {
  return request({
    url: '/income/manage/getAllCompany',
    method: 'get',
  })
}

// 根据id获取企业信息
export function getCompanyById(companyId) {
  return request({
    url: '/income/manage/getCompanyById',
    method: 'get',
    params: { companyId }
  })
}

// 根据id获取关联企业信息
export function getRelatedCompany(companyId) {
  return request({
    url: '/income/manage/getRelatedCompany',
    method: 'get',
    params: { companyId }
  })
}

// 根据关系图中的所有节点（包含节点位置）
export function getAllNode(jsonPoints) {
  return request({
    url: '/income/manage/getAllNode',
    method: 'post',
    data: jsonPoints
  })
}

// 根据关系图中的所有连接
export function getAllLink() {
  return request({
    url: '/income/manage/getAllLink',
    method: 'get',
  })
}

// 提交算法参数
export function submitParam(inputForm) {
    return request({
      url: '/income/manage/submit',
      method: 'post',
      data: inputForm
    })
}

// 获取当前登录用户
export function getCompanyNow() {
  return request({
    url: '/income/manage/getCompanyNow',
    method: 'get',
  })
}

// // 预测收益值
// export function predict(selectedCompanyInfo, relatedCompanyModified, formData) {
//   return request({
//     url: '/income/manage/predict',
//     method: 'post',
//     params: { selectedCompanyInfo,relatedCompanyModified,formData }
//   })
// }

// 预测收益值
export function predict(requestData) {
  return request({
    url: '/income/manage/predict',
    method: 'post',
    data: requestData
  })
}