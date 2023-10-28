import axios, {AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, AxiosRequestHeaders} from 'axios';

const service:AxiosInstance = axios.create({
     baseURL: "/mysterious",
    timeout: 5000
});

service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (localStorage.getItem('ms_username') &&
            localStorage.getItem('token')) {
            (config.headers as AxiosRequestHeaders).token = `${localStorage.getItem('token')}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status === 200) {
            return response;
        } else {
            Promise.reject();
        }
    },
    (error: AxiosError) => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
