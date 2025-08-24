import { 
  RequestConfig, 
  ApiResponse, 
  PaginationParams, 
  PaginatedResponse 
} from '@/types'

export class ApiError extends Error {
  public status: number
  public statusText: string
  public data?: any

  constructor(message: string, status: number, statusText: string, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

export interface ApiClientConfig {
  baseUrl?: string
  headers?: Record<string, string>
  timeout?: number
  withCredentials?: boolean
  retryCount?: number
  retryDelay?: number
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onResponse?: <T>(response: ApiResponse<T>) => ApiResponse<T> | Promise<ApiResponse<T>>
  onError?: (error: ApiError) => void
}

export class ApiClient {
  private config: ApiClientConfig

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      timeout: config.timeout || 30000,
      withCredentials: config.withCredentials || false,
      retryCount: config.retryCount || 3,
      retryDelay: config.retryDelay || 1000,
      onRequest: config.onRequest,
      onResponse: config.onResponse,
      onError: config.onError,
    }
  }

  private async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptor
    let finalConfig = config
    if (this.config.onRequest) {
      finalConfig = await this.config.onRequest(config)
    }

    // Build URL
    const url = new URL(finalConfig.url, this.config.baseUrl)
    
    // Add query parameters
    if (finalConfig.params) {
      Object.entries(finalConfig.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: finalConfig.method,
      headers: {
        ...this.config.headers,
        ...finalConfig.headers,
      },
      credentials: this.config.withCredentials ? 'include' : 'same-origin',
      signal: AbortSignal.timeout(finalConfig.timeout || this.config.timeout!),
    }

    // Add body for non-GET requests
    if (finalConfig.data && finalConfig.method !== 'GET') {
      fetchOptions.body = JSON.stringify(finalConfig.data)
    }

    // Retry logic
    let lastError: ApiError | undefined
    for (let i = 0; i <= this.config.retryCount!; i++) {
      try {
        const response = await fetch(url.toString(), fetchOptions)
        
        // Parse response
        let data: T
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          data = await response.json()
        } else {
          data = await response.text() as T
        }

        // Handle error responses
        if (!response.ok) {
          throw new ApiError(
            `Request failed with status ${response.status}`,
            response.status,
            response.statusText,
            data
          )
        }

        // Build API response
        let apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        }

        // Apply response interceptor
        if (this.config.onResponse) {
          apiResponse = await this.config.onResponse(apiResponse)
        }

        return apiResponse
      } catch (error) {
        if (error instanceof ApiError) {
          lastError = error
        } else if (error instanceof Error) {
          lastError = new ApiError(
            error.message,
            0,
            'Network Error',
            null
          )
        } else {
          lastError = new ApiError(
            'Unknown error occurred',
            0,
            'Unknown Error',
            null
          )
        }

        // Don't retry on client errors (4xx)
        if (lastError.status >= 400 && lastError.status < 500) {
          break
        }

        // Wait before retry
        if (i < this.config.retryCount!) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay!))
        }
      }
    }

    // Call error handler
    if (this.config.onError && lastError) {
      this.config.onError(lastError)
    }

    throw lastError
  }

  // HTTP methods
  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: 'GET',
      params,
    })
    return response.data
  }

  async post<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: 'POST',
      data,
      params,
    })
    return response.data
  }

  async put<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: 'PUT',
      data,
      params,
    })
    return response.data
  }

  async patch<T = any>(url: string, data?: any, params?: Record<string, any>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: 'PATCH',
      data,
      params,
    })
    return response.data
  }

  async delete<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.request<T>({
      url,
      method: 'DELETE',
      params,
    })
    return response.data
  }

  // Pagination helper
  async getPaginated<T = any>(
    url: string,
    params: PaginationParams
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<PaginatedResponse<T>>(url, {
      page: params.page,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      ...params.filters,
      search: params.search,
    })
    
    return response
  }

  // Batch operations
  async batch<T = any>(operations: Array<{
    url: string
    method: RequestConfig['method']
    data?: any
    params?: Record<string, any>
  }>): Promise<T[]> {
    const promises = operations.map(op => 
      this.request<T>({
        url: op.url,
        method: op.method,
        data: op.data,
        params: op.params,
      }).then(res => res.data)
    )
    
    return Promise.all(promises)
  }

  // Upload file
  async upload<T = any>(
    url: string,
    file: File | Blob,
    fieldName = 'file',
    additionalData?: Record<string, any>
  ): Promise<T> {
    const formData = new FormData()
    formData.append(fieldName, file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    const response = await fetch(new URL(url, this.config.baseUrl).toString(), {
      method: 'POST',
      body: formData,
      headers: {
        ...this.config.headers,
        'Content-Type': undefined as any, // Let browser set content-type
      },
      credentials: this.config.withCredentials ? 'include' : 'same-origin',
    })

    if (!response.ok) {
      const error = new ApiError(
        `Upload failed with status ${response.status}`,
        response.status,
        response.statusText
      )
      
      if (this.config.onError) {
        this.config.onError(error)
      }
      
      throw error
    }

    return response.json()
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await fetch(new URL(url, this.config.baseUrl).toString(), {
      method: 'GET',
      headers: this.config.headers,
      credentials: this.config.withCredentials ? 'include' : 'same-origin',
    })

    if (!response.ok) {
      const error = new ApiError(
        `Download failed with status ${response.status}`,
        response.status,
        response.statusText
      )
      
      if (this.config.onError) {
        this.config.onError(error)
      }
      
      throw error
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Update configuration
  updateConfig(config: Partial<ApiClientConfig>) {
    this.config = {
      ...this.config,
      ...config,
      headers: {
        ...this.config.headers,
        ...config.headers,
      },
    }
  }
}

// Default instance
export const apiClient = new ApiClient()