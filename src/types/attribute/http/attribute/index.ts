import { AttributeUIComponent } from '../../../../modules/attribute/types'

export interface Attribute {
  id: string
  name: string
  description: string | null
  is_variant_defining: boolean
  is_filterable: boolean
  handle: string
  ui_component: AttributeUIComponent
  metadata: Record<string, unknown> | null
  possible_values?: Array<{
    id: string
    value: string
    rank: number
    created_at: string
    metadata: Record<string, unknown> | null
  }>
  values?: Array<{
    id: string
    value: string
  }>
  sets?: Array<{
    id: string
    name: string
  }>
  product_categories?: Array<{
    id: string
    name: string
  }>
}

export interface AttributesResponse {
  attributes: Attribute[]
  count: number
  offset: number
  limit: number
}

export * from './admin'