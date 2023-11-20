import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CreateAxiosDefaults,
} from 'axios'

const defaultConfig: CreateAxiosDefaults = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
}

const handleNetworkError = (errStatus: number) => {
  let errMessage = 'Unknown error'
  if (errStatus) {
    switch (errStatus) {
      case 401:
        errMessage = 'Unauthorized'
        break
      case 403:
        errMessage = 'Forbidden'
        break
      case 404:
        errMessage = 'Not Found'
        break
      default:
        errMessage = `Unknown error, status: ${errStatus}`
    }
  } else {
    errMessage = `Unable to connect to server`
  }
  console.error(errMessage)
}

class HTTP {
  #instance: AxiosInstance

  constructor(config: CreateAxiosDefaults<any> | undefined) {
    this.#instance = axios.create({ ...defaultConfig, ...config })
    this.#instance.interceptors.response.use(
      (response) => {
        return response
      },
      (err) => {
        handleNetworkError && handleNetworkError(err.response.status)
        return Promise.reject(err.response)
      }
    )
  }

  async request<T, U = Error>(config: AxiosRequestConfig) {
    return this.#instance
      .request<T>(config)
      .then<[null, T]>((res) => [null, res.data])
      .catch<[U, null]>((err) => [err, null])
  }

  async get<T, U = Error>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ) {
    return this.#instance
      .get<T>(url, { ...config, params })
      .then<[null, T]>((res) => [null, res.data])
      .catch<[U, null]>((err) => [err, null])
  }

  async post<T, U = Error>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) {
    return this.#instance
      .post(url, data, config)
      .then<[null, T]>((res) => [null, res.data])
      .catch<[U, null]>((err) => [err, null])
  }
}

export { HTTP }
