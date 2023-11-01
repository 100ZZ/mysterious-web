import request from '../utils/request';

export const addTestCase = (body: any) => {
    return request({
        url: '/testcase/add',
        method: 'post',
        data: body
    })
}

export const updateTestCase = (id: number, body: any) => {
    return request({
        url: '/testcase/update/' + id,
        method: 'post',
        data: body
    })
}

export const getTestCaseList = (param: any) => {
    return request({
        url: '/testcase/list',
        method: 'get',
        params: param
    });
}

export const getFull = (id: number) => {
    return request({
        url: '/testcase/getFull/' + id,
        method: 'get'
    });
}

export const deleteTestCase = (id: number) => {
    return request({
        url: '/testcase/delete/' + id,
        method: 'get'
    });
}

export const batchDeleteTestCase = (id: number) => {
    return request({
        url: '/testcase/batchDelete/' + id,
        method: 'get'
    });
}

export const debugTestCase = (id: number) => {
    return request({
        url: '/testcase/debug/' + id,
        method: 'get'
    });
}

export const startTestCase = (id: number) => {
    return request({
        url: '/testcase/run/' + id,
        method: 'get'
    });
}

export const stopTestCase = (id: number) => {
    return request({
        url: '/testcase/stop/' + id,
        method: 'get'
    });
}

export const syncNode = (nodeId: number) => {
    return request({
        url: '/testcase/syncNode/' + nodeId,
        method: 'get'
    });
}