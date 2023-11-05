import request from '../utils/request';

export const getJarList = (param: any) => {
    return request({
        url: '/jar/list',
        method: 'get',
        params: param
    });
}

export const deleteJar = (id: number) => {
    return request({
        url: '/jar/delete/' + id,
        method: 'get'
    });
}

export const uploadJar = (testCaseId: number, body: any) => {
    return request({
        url: '/jar/upload/' + testCaseId,
        method: 'post',
        headers:{
            'Content-Type':'multipart/form-data',
        },
        data: body
    })
}