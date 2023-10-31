import request from '../utils/request';

export const getCsvList = (param: any) => {
    return request({
        url: '/csv/list',
        method: 'get',
        params: param
    });
}

export const deleteCsv = (id: number) => {
    return request({
        url: '/csv/delete/' + id,
        method: 'get'
    });
}

export const uploadCsv = (testCaseId: number, body: any) => {
    return request({
        url: '/csv/upload/' + testCaseId,
        method: 'post',
        data: body
    })
}