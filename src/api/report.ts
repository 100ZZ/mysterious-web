import request from '../utils/request';

export const getReportList = (param: any) => {
    return request({
        url: '/report/list',
        method: 'get',
        params: param
    });
}

export const downloadReport = (id: number) => {
    return request({
        url: '/report/download/' + id,
        method: 'get'
    });
}

export const getLog = (id: number) => {
    return request({
        url: '/report/getJMeterLog/' + id,
        method: 'get'
    });
}

export const cleanReport = (id: number) => {
    return request({
        url: '/report/clean/' + id,
        method: 'get'
    });
}

export const viewReport = (id: number) => {
    return request({
        url: '/report/view/' + id,
        method: 'get'
    });
}