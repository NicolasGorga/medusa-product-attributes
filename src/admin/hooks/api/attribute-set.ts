import { QueryKey, useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { medusaClient } from "../../lib/config";
import { queryKeysFactory } from "../../lib/query-key-factory";
import { LinkWorkflowInput, PaginatedResponse } from "@medusajs/types";
import { AttributeSet } from "../../../types/attribute/http/attribute-set";
import { FetchError } from "@medusajs/js-sdk";
import { attributeQueryKeys } from "./attributes";

const ATRIBUTE_SET_QUERY_KEY = "attribute-sets" as const;
export const attributeSetQueryKeys = queryKeysFactory(ATRIBUTE_SET_QUERY_KEY);

export const useAttributeSets = (
  query?: any,
  options?: Omit<
    UseQueryOptions<
      PaginatedResponse<{ attributeSets: AttributeSet[] }>,
      FetchError,
      PaginatedResponse<{ attributeSets: AttributeSet[] }>,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: attributeSetQueryKeys.list(query),
    queryFn: () =>
      medusaClient.client.fetch<
        PaginatedResponse<{ attributeSets: AttributeSet[] }>
      >("/admin/plugin/attribute-set", {
        method: "GET",
      }),
    ...options,
  });
  return { ...data, ...rest };
};

export const useAttributeSet = (
  id: string,
  query?: any,
  options?: Omit<
    UseQueryOptions<
      { attributeSet: AttributeSet },
      FetchError,
      { attributeSet: AttributeSet },
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) => {
  const { data, ...rest } = useQuery({
    queryKey: attributeSetQueryKeys.detail(id, query),
    queryFn: () =>
      medusaClient.client.fetch<{ attributeSet: AttributeSet }>(
        `/admin/plugin/attribute-set/${id}`,
        {
          method: "GET",
        }
      ),
    ...options,
  });

  return { ...data, ...rest };
};

export const useBatchAttributesToSets = (
  attributeSetId: string,
  options?: 
    UseMutationOptions<
      {},
      FetchError,
      Omit<LinkWorkflowInput, 'id'>
    >
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => medusaClient.client.fetch(`/admin/plugin/attribute-set/${attributeSetId}/attributes`, {
      method: 'POST',
      body: payload,
    }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: attributeSetQueryKeys.detail(attributeSetId)
      })
      queryClient.invalidateQueries({
        queryKey: attributeQueryKeys.lists()
      })
      console.log('Invalidated query keys')
      
      options?.onSuccess?.(data, variables, context)
    },
    ...options
  })
}
