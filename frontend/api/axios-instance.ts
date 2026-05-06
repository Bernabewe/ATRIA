import axios, { AxiosRequestConfig } from 'axios';

// Aquí es donde vive tu servidor de Express
export const AXIOS_INSTANCE = axios.create({
    baseURL: 'https://api.gabriel-roman.site/api',
});

// 1. Creamos una funcion para actualizar el token en las cabeceras de Axios
export const setAutorizacionAxios = (token: string | null) => {
    if (token) {
        AXIOS_INSTANCE.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete AXIOS_INSTANCE.defaults.headers.common['Authorization'];
    }
}

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        cancelToken: source.token
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel('Query was cancelled by React Query');
    };

    return promise;
};