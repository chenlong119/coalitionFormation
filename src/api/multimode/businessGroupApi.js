import request from '@/utils/request';

const baseApiUrl = '/businessGroup'; // Adjust the base API URL according to your project

export function getAllDataList() {
  return request({
    url: `${baseApiUrl}/getAllDataList`,
    method: 'get'
  });
}

export function getBusinessGroupById(businessGroupId) {
  return request({
    url: `${baseApiUrl}/getById/${businessGroupId}`,
    method: 'get'
  });
}

export function getBusinessGroupByName(businessGroupName) {
  return request({
    url: `${baseApiUrl}/getByName/${businessGroupName}`,
    method: 'get'
  });
}

export function getBusinessGroupByMode(businessGroupMode) {
  return request({
    url: `${baseApiUrl}/getByMode/${businessGroupMode}`,
    method: 'get'
  });
}

export function getBusinessGroupByTask(businessGroupTask) {
  return request({
    url: `${baseApiUrl}/getByTask/${businessGroupTask}`,
    method: 'get'
  });
}

export function getBusinessGroupPage(businessGroup) {
  return request({
    url: `${baseApiUrl}/getPage`,
    method: 'post',
    // 不再传递 businessGroup 参数
    data: businessGroup
  });
}

//用于获取每种协同模式的数量
export function getBusinessGroupModeCount() {
  return request({
    url: `${baseApiUrl}/countByMode`,
    method: 'get'
  });
}
export function getBusinessCount() {
  return request({
    url: `${baseApiUrl}/count`,
    method: 'get'
  });
}