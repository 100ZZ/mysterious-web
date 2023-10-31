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

export const uploadJmx = (testCaseId: number, body: any) => {
    return request({
        url: '/jmx/upload/' + testCaseId,
        method: 'post',
        data: body
    })
}