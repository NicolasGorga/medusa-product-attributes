import { AdminCreateAttributeType } from "../../../../api/admin/plugin/attributes/validators"

export type CreateAttributesWorkflowInput = {
    attributes: AdminCreateAttributeType[]
}

export type CreateAttributeStepInput = Omit<AdminCreateAttributeType, 'product_category_ids'>[]

// Attributes

/**
 * @interface
 * 
 * The data to update the attribute.
 */
export interface UpdateAttributeDTO {
    /**
     * The id of the attribute to update.
     */
    id: string
    
    /**
     * The name of the attribute.
     */
    name?: string

    /**
     * The description of the attribute.
     */
    description?: string

    /**
     * Whether the attribute should be used as a Blueprint for options
     * when creating them a product variant.
     */
    is_variant_defining?: boolean

    /**
     * Whether the attribute can be used to filter products.
     */
    is_filterable?: boolean

    /**
     * The handle of the attribute. The handle can be used to create slug URL paths.
     * If not supplied, the value of the `handle` attribute of the attribute is set to the slug version of the `name` property.
     */
    handle?: string

    /**
     * Holds custom data in key-value pairs.
     */
    metadata?: Record<string, unknown>

    /**
     * The associated product categories
     */
    categories?: { id: string }[]
}

/**
 * @interface
 * 
 * The data to update an attribute value.
 */
export interface UpdateAttributeValueDTO {
    /**
     * The id of the attribute value to update.
     */
    id: string

    /**
     * The value of the attribute value.
     */
    value?: string

    /**
     * The rank of the attribute value. Useful to visually order it on dropdowns.
     */
    rank?: number

    /**
     * Holds custom data in key-value pairs.
     */
    metadata?: Record<string, unknown> | null
}