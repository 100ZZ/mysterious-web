import request from '../utils/request';
import {AxiosResponse} from "axios";

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

export const downloadJar = async (id: number, jarName: string) => {
    try {
        const response: AxiosResponse<Blob> = await request({
            url: '/jar/download/' + id,
            method: 'get',
            responseType: 'blob', // Important: Set responseType to 'blob' to handle binary data
        });

        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', jarName); // Set the filename here
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