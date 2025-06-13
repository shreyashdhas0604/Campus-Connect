import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

class APIClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true // Enable sending cookies
    });

    this.initializeRequestInterceptor();
    this.initializeResponseInterceptor();
  }

  private processQueue = (error: any, token: string | null = null) => {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  };

  private initializeRequestInterceptor = () => {
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  };

  private initializeResponseInterceptor = () => {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            try {
              const token = await new Promise<string>((resolve, reject) => {
                this.failedQueue.push({ 
                  resolve: resolve as (value?: unknown) => void,
                  reject 
                });
              });
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return await this.axiosInstance(originalRequest);
            } catch (err) {
              return await Promise.reject(err);
            }
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          return new Promise((resolve, reject) => {
            this.refreshAccessToken()
              .then((newAccessToken) => {
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                this.processQueue(null, newAccessToken);
                resolve(this.axiosInstance(originalRequest));
              })
              .catch((err) => {
                this.processQueue(err, null);
                reject(err);
              })
              .finally(() => {
                this.isRefreshing = false;
              });
          });
        }

        return Promise.reject(error);
      }
    );
  };

  private refreshAccessToken = async (): Promise<string> => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/user/refresh-token',
        { refreshToken: localStorage.getItem('refreshToken') },
        { withCredentials: true }
      );
      const newAccessToken = response.data.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  };

  public get = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.get<T>(url, config);
  };

  public post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.post<T>(url, data, config);
  };

  public put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.put<T>(url, data, config);
  };

  public delete = <T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.delete<T>(url, config);
  };

  public patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return this.axiosInstance.patch<T>(url, data, config); 
  };
}

const apiClient = new APIClient('http://localhost:8085/api');

export default apiClient;
