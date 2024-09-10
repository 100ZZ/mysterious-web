import request from '../utils/request';

export const getJmxList = (param: any) => {
    return request({
        url: '/jmx/list',
        method: 'get',
        params: param
    });
}

export const deleteJmx = (id: number) => {
    return request({
        url: '/jmx/delete/' + id,
        method: 'get'
    });
}

export const uploadJmx = (testCaseId: number, formData: FormData) => {
    return request({
        url: '/jmx/upload/' + testCaseId,
        method: 'post',
        headers:{
            'Content-Type':'multipart/form-data',
        },
        data: formData
    })
}

export const downloadJmx = (id: number) => {
    return request({
        url: '/jmx/download/' + id,
        method: 'get'
    });
}

export const addOnlineJmx = (body: any) => {
    return request({
        url: '/jmx/addOnline',
        method: 'post',
        data: body
    })
}

export const updateOnlineJmx = (id: number, body: any) => {
    return request({
        url: '/jmx/updateOnline/' + id,
        method: 'post',
        data: body
    })
}

export const getOnlineJmx = (id: number) => {
    return request({
        url: '/jmx/getOnline/' + id,
        method: 'get'
    });
}