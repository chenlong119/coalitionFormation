import request from '@/utils/request';

const baseApiUrl = '/genetic-algorithm'; 
export function runGeneticAlgorithm() {
    return request({
        url: `${baseApiUrl}/run`,
        method: 'get'
    });
}

export function getActiveTasks() {
    return request({
        url: `${baseApiUrl}/activetask`,
        method: 'get'
    });
}

export function sendSolutionToBackend(solutionData) {
    return request({
        url: `/solutions/addSolution`,
        method: 'post',
        data: solutionData
    });
}
export function fetchCoalitionDetails() {
    return request({
        url: `/coalition/details`,
        method: 'get'
    });
}
export function modeShow() {
    return request({
        url: `/mode/getAllModes`,
        method: 'get'
    });
}
export function getAllScoreRecords() {
    return request({
        url: `/scoreRecords/all/details`,
        method: 'get'
    });
}




export function getFaultyMachinesInfo() {
    return request({
        url: `${baseApiUrl}/getFaultyMachinesInfo`,
        method: 'get'
    });
}
export function getFaultyMachines() {
    return request({
        url: `${baseApiUrl}/getFaultyMachines`,
        method: 'get'
    });
}
export function getTaskByTaskId(taskId) {
    return request({
      url: `/getTask/getTaskNameById/${taskId}`,
      method: 'get'
    });
  }
  export function getMachinesForJob(jobId) {
    return request({
        url: `${baseApiUrl}/getMachinesForJob/${jobId}`,
        method: 'get'
    });
}
export function getBusinessNamesByIds(businessIds) {
    return request({
        url: `${baseApiUrl}/getBusinessNamesByIds`,
        method: 'post',
        data: businessIds
    });
}
export function getTasksCrossInfo() {
    return request({
        url: `${baseApiUrl}/tasks-cross-info`, 
        method: 'get'
    });
}
//饼状图获取完成率
export function getAllModes() {
    return request({
        url: `/modeEvaluate/getAllModes`,
        method: 'get',
    });
}
export function getModeDetails(modeName) {
    return request({
      url: `/modeEvaluate/getModeDetails?modeName=${encodeURIComponent(modeName)}`,
      method: 'get',
    });
  }
  // 根据模式名称获取完成率
export function getCompletionRate(modeName) {
    return request({
        url: `/modeEvaluate/getCompletionRate/${modeName}`,
        method: 'get',
    });
}

// 根据模式名称获取故障发生率
export function getFailureRate(modeName) {
    return request({
        url: `/modeEvaluate/getFailureRate/${modeName}`,
        method: 'get',
    });
}

export function fetchBusinessLocations() {
    return request({
        url: `/businessLocations/getDatalist`,
        method: 'get',
    });
}

export function fetchBusinessDirections() {
    return request({
        url: `/businessDirection/getDatalist`,
        method: 'get',
    });
}
export function fetchBusinessHistory(historyId) {
    const ids = historyId.split(',').map(id => id.trim());
    return request({
        url: `/businessHistory/historyById`,
        method: 'post',
        data: ids
    });
}
export function fetchAllModesSorted() {
    return request({
        url: '/modeEvaluate/getAllModesSorted',
        method: 'get',
    });
}
export function getBusinessNameById(faultyMachine) {
    return request({
        url: `${baseApiUrl}/getBusinessNameById/${faultyMachine}`,
        method: 'get'
    });
}
export function updateBusinessDirection(data) {
    return request({
        url: `/businessDirection/update`,
        method: 'post',
        data: data
    });
}
export function getCompanyNow() {
    return request({
        url: `/businessLocations/getCompanyNow`,
        method: 'get',
    })
}