import { QueryKey, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { PaginatedResponse } from "@medusajs/types"
import { Attribute, AttributePossibleValue } from "../../../types/attribute/http/attribute"
import { FetchError } from "@medusajs/js-sdk"
import { medusaClient } from "../../lib/config"
import { attributeSetQueryKeys } from "./attribute-set"

const ATTRIBUTE_QUERY_KEY = 'attribute' as const
export const attributeQueryKeys = queryKeysFactory(ATTRIBUTE_QUERY_KEY)

export const useAttributes = (
    query?: any,
    options?: Omit<
        UseQueryOptions<
            PaginatedResponse<{ attributes: Attribute[] }>,
            FetchError,
            PaginatedResponse<{ attributes: Attribute[] }>,
            QueryKey
        >,
        "queryFn" | "queryKey"
    >
) => {
    const { data, ...rest } = useQuery({
        queryKey: attributeQueryKeys.list(query),
        queryFn: () => 
            medusaClient.client.fetch<PaginatedResponse<{ attributes: Attribute[] }>>('/admin/plugin/attributes', {
                method: 'GET',
                query,
            }),
        ...options,
    })
    return { ...data, ...rest }
}

export const useAttribute = (
    id: string,
    query?: Record<string, unknown>,
    options?: Omit<
        UseQueryOptions<
            { attribute: Attribute },
            FetchError,
            { attribute: Attribute },
            QueryKey
        >,
        "queryFn" | "queryKey"
    >
) => {
    const { data, ...rest } = useQuery({
        queryKey: attributeQueryKeys.detail(id, query),
        queryFn: () => 
            medusaClient.client.fetch<{ attribute: Attribute }>(`/admin/plugin/attributes/${id}`, {
                method: 'GET',
                query,
            }),
        ...options,
    })
    return { ...data, ...rest }
}

export const useUpdateAttribute = (
    id: string,
    options?: 
      UseMutationOptions<
        { attribute: Attribute },
        FetchError,
        Partial<Pick<Attribute, 'name' | 'handle' | 'description' | 'metadata'>>
      >
  ) => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: (payload) => medusaClient.client.fetch(`/admin/plugin/attributes/${id}`, {
        method: 'POST',
        body: payload
      }),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: attributeQueryKeys.detail(id)
        })
        queryClient.invalidateQueries({
          queryKey: attributeQueryKeys.list()
        })
  
        options?.onSuccess?.(data, variables, context)
      },
      ...options
    })
  }

  const ATTRIBUTE_POSSIBLE_VALUE_QUERY_KEY = 'attribute-possible-value' as const
  export const attributePossibleValueQueryKeys = queryKeysFactory(ATTRIBUTE_POSSIBLE_VALUE_QUERY_KEY)

  export const useUpdateAttributePossibleValue = (
    attributeId: string,
    possibleValueId: string,
    options?: 
      UseMutationOptions<
        { possible_value: AttributePossibleValue },
        FetchError,
        Partial<Pick<AttributePossibleValue, 'value' | 'rank' | 'metadata'>>
      >
  ) => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationFn: (payload) => medusaClient.client.fetch(`/admin/plugin/attributes/${attributeId}/values/${possibleValueId}`, {
        method: 'POST',
        body: payload
      }),
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries({
          queryKey: attributeQueryKeys.detail(attributeId)
        })
        queryClient.invalidateQueries({
          queryKey: attributeQueryKeys.list()
        })
        queryClient.invalidateQueries({
           queryKey: attributePossibleValueQueryKeys.detail(possibleValueId)
        })
  
        options?.onSuccess?.(data, variables, context)
      },
      ...options
    })
  }