import request from '../utils/request';

export const addConfig = (body: any) => {
    return request({
        url: '/config/add',
        method: 'post',
        data: body
    })
}

export const updateConfig = (id: number, body: any) => {
    return request({
        url: '/config/update/' + id,
        method: 'post',
        data: body
    })
}

export const getConfigList = (param: any) => {
    return request({
        url: '/config/list',
        method: 'get',
        params: param
    });
}

export const deleteConfig = (id: number) => {
    return request({
        url: '/config/delete/' + id,
        method: 'get'
    });
}