import request from '../utils/request';


export const login = (body: {
    username: string,
    password: string
}) => {
    return request({
        url: '/user/login',
        method: 'post',
        data: body
    })
}

export const addUser = (body: {
    username: string,
    password: string
}) => {
    return request({
        url: '/user/add',
        method: 'post',
        data: body
    })
}

export const getUserList = (param: any) => {
    return request({
        url: '/user/list',
        method: 'get',
        params: param
    });
}

export const deleteUser = (id: number) => {
    return request({
        url: '/user/delete/' + id,
        method: 'get'
    });
}