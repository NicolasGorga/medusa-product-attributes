import { model } from "@medusajs/framework/utils"
import AttributeValue from "./attribute-value"

const Attribute = model.define('attribute', {
    id: model.id({ prefix: 'attr' }).primaryKey(),
    name: model.text().index('IDX_ATTRIBUTE_NAME').searchable(),
    description: model.text().nullable(),
    is_variant_defining: model.boolean().default(true),
    is_filterable: model.boolean().default(true),
    handle: model.text().unique(),
    metadata: model.json().nullable(),
    values: model.hasMany(() => AttributeValue),
}).cascades({
    delete: ['values']
})

export default Attribute