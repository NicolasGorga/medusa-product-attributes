export enum AttributeUIComponent {
  TYPEAHEAD = 'typeahead',
  MULTIVALUE = 'multivalue',
  UNIT = 'unit',
  TOGGLE = 'toggle',
  TEXTAREA = 'text-area',
  COLOR_PICKER = 'color_picker'
}

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