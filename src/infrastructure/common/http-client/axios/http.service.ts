import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  private readonly axios: AxiosInstance;

  constructor() {
    this.axios = axios;
  }

  get(url: string, config = {}): Promise<AxiosResponse> {
    return this.axios.get(url, config);
  }

  post(url: string, data: unknown, config = {}): Promise<AxiosResponse> {
    return this.axios.post(url, data, config);
  }

  put(url: string, data: unknown, config = {}): Promise<AxiosResponse> {
    return this.axios.put(url, data, config);
  }

  delete(url: string, config = {}): Promise<AxiosResponse> {
    return this.axios.delete(url, config);
  }
}
