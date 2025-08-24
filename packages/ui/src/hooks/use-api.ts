import { useQuery, useMutation, useInfiniteQuery, UseQueryOptions, UseMutationOptions, UseInfiniteQueryOptions } from '@tanstack/react-query'
import { apiClient, ApiClient, ApiClientConfig } from '@/lib/api-client'
import { PaginationParams, PaginatedResponse } from '@/types'

// Query key factory
export const queryKeys = {
  all: ['prismate'] as const,
  models: () => [...queryKeys.all, 'models'] as const,
  model: (name: string) => [...queryKeys.models(), name] as const,
  modelList: (name: string, params?: PaginationParams) => 
    [...queryKeys.model(name), 'list', params] as const,
  modelDetail: (name: string, id: string | number) => 
    [...queryKeys.model(name), 'detail', id] as const,
}

// Fetch list hook
export function useModelList<T = any>(
  modelName: string,
  params: PaginationParams,
  options?: UseQueryOptions<PaginatedResponse<T>>
) {
  return useQuery({
    queryKey: queryKeys.modelList(modelName, params),
    queryFn: () => apiClient.getPaginated<T>(`/models/${modelName}`, params),
    ...options,
  })
}

// Fetch detail hook
export function useModelDetail<T = any>(
  modelName: string,
  id: string | number,
  options?: UseQueryOptions<T>
) {
  return useQuery({
    queryKey: queryKeys.modelDetail(modelName, id),
    queryFn: () => apiClient.get<T>(`/models/${modelName}/${id}`),
    enabled: Boolean(id),
    ...options,
  })
}

// Create mutation hook
export function useCreateModel<T = any, V = any>(
  modelName: string,
  options?: UseMutationOptions<T, Error, V>
) {
  return useMutation({
    mutationFn: (data: V) => apiClient.post<T>(`/models/${modelName}`, data),
    ...options,
  })
}

// Update mutation hook
export function useUpdateModel<T = any, V = any>(
  modelName: string,
  options?: UseMutationOptions<T, Error, { id: string | number; data: V }>
) {
  return useMutation({
    mutationFn: ({ id, data }) => 
      apiClient.put<T>(`/models/${modelName}/${id}`, data),
    ...options,
  })
}

// Delete mutation hook
export function useDeleteModel<T = any>(
  modelName: string,
  options?: UseMutationOptions<T, Error, string | number>
) {
  return useMutation({
    mutationFn: (id) => apiClient.delete<T>(`/models/${modelName}/${id}`),
    ...options,
  })
}

// Bulk delete mutation hook
export function useBulkDeleteModel<T = any>(
  modelName: string,
  options?: UseMutationOptions<T, Error, (string | number)[]>
) {
  return useMutation({
    mutationFn: (ids) => 
      apiClient.post<T>(`/models/${modelName}/bulk-delete`, { ids }),
    ...options,
  })
}

// Infinite query hook
export function useInfiniteModelList<T = any>(
  modelName: string,
  params: Omit<PaginationParams, 'page'>,
  options?: UseInfiniteQueryOptions<PaginatedResponse<T>>
) {
  return useInfiniteQuery({
    queryKey: queryKeys.modelList(modelName, params as PaginationParams),
    queryFn: ({ pageParam = 1 }) => 
      apiClient.getPaginated<T>(`/models/${modelName}`, {
        ...params,
        page: pageParam as number,
      }),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    ...options,
  })
}

// Custom API hook
export function useApi() {
  return apiClient
}

// Custom API client hook with config
export function useApiClient(config?: ApiClientConfig) {
  return new ApiClient(config)
}