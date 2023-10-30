import request from '../utils/request';

export const addNode = (body: any) => {
    return request({
        url: '/node/add',
        method: 'post',
        data: body
    })
}

export const updateNode = (id: number, body: any) => {
    return request({
        url: '/node/update/' + id,
        method: 'post',
        data: body
    })
}

export const getNodeList = (param: any) => {
    return request({
        url: '/node/list',
        method: 'get',
        params: param
    });
}

export const deleteNode = (id: number) => {
    return request({
        url: '/node/delete/' + id,
        method: 'get'
    });
}

export const enableNode = (id: number) => {
    return request({
        url: '/node/enable/' + id,
        method: 'get'
    });
}

export const disableNode = (id: number) => {
    return request({
        url: '/node/disable/' + id,
        method: 'get'
    });
}