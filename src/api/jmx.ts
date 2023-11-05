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