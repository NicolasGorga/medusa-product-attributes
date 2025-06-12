import { AttributeUIComponent } from "../types"
import AttributePossibleValue from "./attribute-possible-value"
import AttributeSet from "./attribute-set"
import AttributeValue from "./attribute-value"
import { model } from "@medusajs/framework/utils"

const Attribute = model.define('attribute', {
    id: model.id({ prefix: 'attr' }).primaryKey(),
    name: model.text().index('IDX_ATTRIBUTE_NAME').searchable(),
    description: model.text().nullable(),
    is_variant_defining: model.boolean().default(true),
    is_filterable: model.boolean().default(true),
    handle: model.text().unique(),
    ui_component: model.enum(Object.values(AttributeUIComponent)).default(AttributeUIComponent.SELECT),
    metadata: model.json().nullable(),
    possible_values: model.hasMany(() => AttributePossibleValue),
    values: model.hasMany(() => AttributeValue),
    sets: model.manyToMany(() => AttributeSet, { mappedBy: 'attributes' }),
}).cascades({
    delete: ['values', 'possible_values']
})

export default Attribute