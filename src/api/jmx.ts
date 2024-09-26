import request from '../utils/request';
import {AxiosResponse} from "axios";

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

export const uploadJmx = (testCaseId: number, formData: FormData) => {
    return request({
        url: '/jmx/upload/' + testCaseId,
        method: 'post',
        headers:{
            'Content-Type':'multipart/form-data',
        },
        data: formData
    })
}

export const viewJmx = (id: number) => {
    return request({
        url: '/jmx/view/' + id,
        method: 'get'
    });
};

export const downloadJmx = async (id: number, jmxName: string) => {
    try {
        const response: AxiosResponse<Blob> = await request({
            url: '/jmx/download/' + id,
            method: 'get',
            responseType: 'blob', // Important: Set responseType to 'blob' to handle binary data
        });

        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', jmxName); // Set the filename here
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

export const addOnlineJmx = (body: any) => {
    return request({
        url: '/jmx/addOnline',
        method: 'post',
        data: body
    })
}

export const updateOnlineJmx = (id: number, body: any) => {
    return request({
        url: '/jmx/updateOnline/' + id,
        method: 'post',
        data: body
    })
}

export const getOnlineJmx = (id: number) => {
    return request({
        url: '/jmx/getOnline/' + id,
        method: 'get'
    });
}