import { createFindParams, createSelectParams, WithAdditionalData } from '@medusajs/medusa/api/utils/validators'

import { z } from 'zod'
import { AttributeUIComponent } from '../../../../modules/attribute/types'

export type AdminCreateAttributeValueType = z.infer<typeof AdminCreateAttributeValue>
export const AdminCreateAttributeValue = z.object({
    value: z.string(),
    rank: z.number(),
    metadata: z.record(z.unknown()).optional(),
})

export type AdminUpdateAttributeValueType = z.infer<typeof AdminUpdateAttributeValue>
export const AdminUpdateAttributeValue = z.object({
    id: z.string().optional(),
    value: z.string().optional(),
    rank: z.number().optional(),
    metadata: z.record(z.unknown()).nullish(),
})

export type AdminGetAttributeValueParamsType = z.infer<typeof AdminGetAttributeValueParams>
export const AdminGetAttributeValueParams = createSelectParams()

export type AdminGetAttributeValuesParamsType = z.infer<typeof AdminGetAttributeValueParams>
export const AdminGetAttributeValuesParams = createFindParams()

export type AdminCreateAttributeType = z.infer<typeof CreateAttribute>
export const CreateAttribute = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    ui_component: z.nativeEnum(AttributeUIComponent).default(AttributeUIComponent.SELECT),
    is_variant_defining: z.boolean().default(true),
    is_filterable: z.boolean().default(true),
    handle: z.string().optional(),
    metadata: z.record(z.unknown()).nullish(),
    possible_values: z.array(AdminCreateAttributeValue).optional(),
    product_category_ids: z.array(z.string()).optional()
})

export const AdminCreateAttribute = WithAdditionalData(
    CreateAttribute,
    (schema) => {
      return schema.refine(
        (data) => data.ui_component !== AttributeUIComponent.SELECT || (data.possible_values && data.possible_values.length > 0),
        {
            message: "Possible values are required when ui_component is SELECT",
            path: ["possible_values"]
        }
    )
    }
  )

export type AdminGetAttributeParamsType = z.infer<typeof AdminGetAttributeParams>
export const AdminGetAttributeParams = createSelectParams()

export type AdminGetAttributesParamsType = z.infer<typeof AdminGetAttributesParams>
export const AdminGetAttributesParams = createFindParams({
    offset: 0,
    limit: 50,
})

export type AdminUpdateAttributeType = z.infer<typeof AdminUpdateAttribute>
export const AdminUpdateAttribute = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    is_variant_defining: z.boolean().optional(),
    is_filterable: z.boolean().optional(),
    handle: z.string().nullish(),
    metadata: z.record(z.unknown()).nullish(),
    categories: z.array(z.object({
        id: z.string()
    })).nullish(),
    possible_values: z.array(AdminUpdateAttributeValue).optional()
}).strict()
