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

export const uploadJmx = (id: number, body: any) => {
    return request({
        url: '/upload/' + id,
        method: 'post',
        data: body
    })
}