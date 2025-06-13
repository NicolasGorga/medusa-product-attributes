import { applyAndAndOrOperators } from '@medusajs/medusa/api/utils/common-validators/common'
import { createFindParams, createOperatorMap, createSelectParams } from '@medusajs/medusa/api/utils/validators'
import { z } from 'zod'

export const AdminGetAttributeSetParams = createSelectParams()
export type AdminGetAttributeSetParamsType = z.infer<typeof AdminGetAttributeSetParams>

export const GetAttributeSetsParams = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    handle: z.string().optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
    deleted_at: createOperatorMap().optional(),
})
export const AdminGetAttributeSetsParams = createFindParams({
    offset: 0,
    limit: 50,
})
.merge(applyAndAndOrOperators(GetAttributeSetsParams))
.merge(GetAttributeSetsParams)

export type AdminGetAttributesSetsParamsType = z.infer<typeof AdminGetAttributeSetsParams>

const AdminBaseAttributeSet = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    handle: z.string().optional(),
    metadata: z.record(z.unknown()).nullish(),
    attributes: z.array(z.string()).optional(),
}).strict()

export type AdminCreateAttributeSetType = z.infer<typeof AdminCreateAttributeSet>
export const AdminCreateAttributeSet = AdminBaseAttributeSet.merge(z.object({
    name: z.string().min(1),
})).strict()

export type AdminUpdateAttributeSetType = z.infer<typeof AdminUpdateAttributeSet>
export const AdminUpdateAttributeSet = AdminBaseAttributeSet

export type AdminBatchLinkAttributeSetAttributesType = z.infer<typeof AdminBatchLinkAttributeSetAttributes>
export const AdminBatchLinkAttributeSetAttributes = z.object({
    add: z.array(z.string()).optional(),
    remove: z.array(z.string()).optional(),
})