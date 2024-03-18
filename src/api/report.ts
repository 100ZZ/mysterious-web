import request from '../utils/request';
import {AxiosResponse} from "axios";

export const getReportList = (param: any) => {
    return request({
        url: '/report/listByTestCase',
        method: 'get',
        params: param
    });
}

export const downloadReport = async (id: number) => {
    try {
        const response: AxiosResponse<Blob> = await request({
            url: '/report/download/' + id,
            method: 'get',
            responseType: 'blob', // Important: Set responseType to 'blob' to handle binary data
        });

        // Create a blob URL for the downloaded file
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', id + '_data.zip'); // Set the filename here
        document.body.appendChild(link);
        link.click();

        // Clean up the object URL after the download
        window.URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Error downloading file:', error);
        return { success: false, error };
    }
};

// export const downloadReport = (id: number) => {
//     return request({
//         url: '/report/download/' + id,
//         method: 'get'
//     });
// }

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