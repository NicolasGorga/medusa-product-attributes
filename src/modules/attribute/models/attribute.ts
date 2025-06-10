import AttributePossibleValue from "./attribute-possible-value"
import AttributeSet from "./attribute-set"
import AttributeValue from "./attribute-value"
import { model } from "@medusajs/framework/utils"

enum AttributeUIComponent {
    TYPEAHEAD = 'typeahead', // ui component with custom text but suggested values which are represented in possible value table
    MULTIVALUE = 'multivalue',
    UNIT = 'unit', // cantimeters, grams etc which are represented in scale table
    TOGGLE = 'toggle',
    TEXTAREA = 'text-area',
    COLOR_PICKER = 'color_picker'
}

const Attribute = model.define('attribute', {
    id: model.id({ prefix: 'attr' }).primaryKey(),
    name: model.text().index('IDX_ATTRIBUTE_NAME').searchable(),
    description: model.text().nullable(),
    is_variant_defining: model.boolean().default(true),
    is_filterable: model.boolean().default(true),
    handle: model.text().unique(),
    ui_component: model.enum(Object.values(AttributeUIComponent)),
    metadata: model.json().nullable(),
    possible_values: model.hasMany(() => AttributePossibleValue),
    values: model.hasMany(() => AttributeValue),
    sets: model.manyToMany(() => AttributeSet, { mappedBy: 'attributes' }),
}).cascades({
    delete: ['values']
})

export default Attribute