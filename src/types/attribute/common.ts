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
     * The associated attribute values to create or update. If "id" is not provided, it will try to update an existent attribute,
     * matching by "value", if not found, it will create a new one and "value" is required.
     */
    possible_values?: UpsertAttributeValueDTO[]

    /**
     * The associated product categories.
     */
    product_category_ids?: { id: string }[]
}

/**
 * @interface
 * 
 * The data to update or create an attribute value.
 */
export interface UpsertAttributeValueDTO {
    /**
     * The id of the attribute value to update.
     */
    id?: string

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
    metadata?: Record<string, unknown>

    /**
     * The id of the associated attribute.
     */
    attribute_id?: string
}

/**
 * @interface
 * 
 * The data to create the attribute value.
 */
export interface CreateAttributeValueDTO {
    value: string
    rank: number
    attribute_id: string
    metadata?: Record<string, unknown>
}

/**
 * @interface
 * 
 * The data to update or create an attribute value.
 */
export interface UpsertAttributeValueDTO {
    /**
     * The id of the attribute value to update.
     */
    id?: string

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
    metadata?: Record<string, unknown>

    /**
     * The id of the associated attribute.
     */
    attribute_id?: string
}

/**
 * @interface
 * 
 * The data to update an attribute value
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
    metadata?: Record<string, unknown>

    /**
     * The id of the associated attribute.
     */
    attribute_id?: string
}

export interface ProductAttributeValueDTO {
    /**
     * The value of the attribute value.
     */
    value: string;
     /**
     * The id of the associated attribute.
     */
    attribute_id: string;
}