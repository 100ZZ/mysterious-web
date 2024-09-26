import request from '../utils/request';
import {AxiosResponse} from "axios";

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
        headers:{
            'Content-Type':'multipart/form-data',
        },
        data: body
    })
}

export const viewCsv = (id: number) => {
    return request({
        url: '/csv/view/' + id,
        method: 'get'
    });
}

export const downloadCsv = async (id: number, csvName: string) => {
    try {
        const response: AxiosResponse<Blob> = await request({
            url: '/csv/download/' + id,
            method: 'get',
            responseType: 'blob', // Important: Set responseType to 'blob' to handle binary data
        });

        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', csvName); // Set the filename here
        document.body.appendChild(link);
        link.click();

        // Clean up the object URL after the download
        window.URL.revokeObjectURL(url);

        return {success: true};
    } catch (error) {
        console.error('Error downloading file:', error);
        return {success: false, error};
    }
};
