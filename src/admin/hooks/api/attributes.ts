import { QueryKey, useQuery, UseQueryOptions } from "@tanstack/react-query"
import { queryKeysFactory } from "../../lib/query-key-factory"
import { PaginatedResponse } from "@medusajs/types"
import { Attribute } from "../../../types/attribute/http/attribute"
import { FetchError } from "@medusajs/js-sdk"
import { medusaClient } from "../../lib/config"

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