import axios from 'axios';
import request from '@/utils/request';

const service = axios.create({
    baseURL: 'http://127.0.0.1:80',
    timeout: 5000,
    withCredentials: true
});

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // 确保返回整个响应对象
            return response;
        } else {
            // 处理错误
            console.error("API错误:", response.statusText);
            throw new Error(response.statusText || "Error");
        }
    },
    error => {
        // 处理错误
        console.error("API错误:", error.message);
        throw error;
    }
);

export const submitFeedback = async (formData) => {
    console.log(formData);
    return request({
        url: '/multig/feedback/submit',
        method: 'post',
        data: formData
    });
};

export const fetchTaskCompanyInfo = async (taskId, companyId) => {
    return request({
        url: '/api/taskCompanyInfo',
        method: 'get',
        params: { taskId, companyId }
    });
};

// 确保 fetchAllTasks 是一个异步函数或返回 Promise
export const fetchAllTasks = async () => {
    const response = await request({
        url: '/api/tasks',
        method: 'get'
    });
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('Data:', response.data);
    return response;
};

export const fetchAllCompanies = async (taskId) => {
    return request({
        url: '/api/companies',
        method: 'get',
        params: { taskId }
    });
};
export const fetchCompaniesByTaskId = async (taskId) => {
    return request({
        url: `/api/companies/byTask?taskId=${taskId}`,
        method: 'get'
    });
};
// 在您的 API 方法文件中添加新的函数
export const submitScoreRecord = async (scoreRecord) => {
    return request({
        url: '/api/scoresave/submit',
        method: 'post',
        data: scoreRecord
    });
};
export const fetchScoreHistory = async () => {
    return request({
        url: '/api/scoresave/history',
        method: 'get',

    });
};

