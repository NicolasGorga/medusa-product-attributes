export const defaultAdminAttributeSetFields = [
    'id',
    'name',
    'description',
    'handle',
    'metadata',
    '*attributes',
    '*attributes.possible_values',
]

export const retrieveAttributeSetQueryConfig = {
    defaults: defaultAdminAttributeSetFields,
    isList: false,
}

export const listAttributeSetQueryConfig = {
    ...retrieveAttributeSetQueryConfig,
    defaultLimit: 50,
    isList: true,
}