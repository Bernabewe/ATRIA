import axios, { AxiosRequestConfig } from 'axios';

// Aquí es donde vive tu servidor de Express
// Para pruebas en Android con localhost, a veces se usa 10.0.2.2
export const AXIOS_INSTANCE = axios.create({ 
  baseURL: 'http://localhost:3000/api' 
});

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