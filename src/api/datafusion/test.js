import axios from "axios";
import request from "@/utils/request";

const service = axios.create({
    baseURL:'http://127.0.0.1:80',
    timeout:5000,
    withCredentials:true
});

service.interceptors.response.use(
    response =>{
        if(response.status !== 200){
            console.log("error",response.data.message || "Error");
            throw new Error(response.data.message || "Error");
        }
        return response;
    },
    error => {
        console.error("error",error.message);
        throw error;
    }
);

// export const submitData = async (formData) =>{
//     console.log(formData);
//     return request({
//         url:'dataFusion/test',
//         method:'post',
//         data: formData
//     })
// }

export function getAllCompany() {
    return request({
        url: '/dataFusion',
        method: 'get',
    })
}

export function getAllCompanyWithoutLocation() {
    return request({
        url: '/dataFusion/list',
        method: 'get',
    })
}

export function getAllCompanyAndLink() {
    return request({
        url: '/dataFusion/relation1',
        method: 'get',
    })
}

export function getTotalRelation() {
    return request({
        url: '/dataFusion/relation2',
        method: 'get',
    })
}

export function getGroupInfo() {
    return request({
        url: '/dataFusion/group',
        method: 'get',
    })
}

export function searchSingleCompanyByName(name){
    return request({
        url: '/dataFusion/searchByName',
        method: 'get',
        params: { name }
    })
}

export function getImportantNodes() {
    return request({
        url: '/dataFusion/searchImportantNode',
        method: 'get',
    })
}

export function addAssessment(data) {
    return request({
        url: '/dataFusion/assessment',
        method: 'post',
        data: data
    })
}

export function getAssessments() {
    return request({
        url: '/dataFusion/assessments',
        method: 'get',
    })
}

export function deleteAssessment(id) {
    return request({
        url: '/dataFusion/deleteAssessment/' + id,
        method: 'delete'
    })
}