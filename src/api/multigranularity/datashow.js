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

// 获取排行榜列表
export const fetchGroupRanking = async () => {

    return request({
        url: '/system/ranking/list',
        method: 'get',
    });

};

// 更新排行榜某一项
export const updateGroupRanking = async (groupRanking) => {
    return axios.post('/system/ranking/update', groupRanking);
};
export const fetchCompanyRanking = async () => {

    return request({
        url: '/system/companyRanking/list',
        method: 'get',
    });

};
export const fetchEnterprises = async() => {
    return request({
        url: '/multigshow/enterprise/list',
        method: 'get'
    });
};
export const fetchMonthlyStatistics = async () => {
    return request({
        url: '/api/statistics/monthly',
        method: 'get'
    });
};
