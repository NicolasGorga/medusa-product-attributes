import { useParams } from 'react-router-dom'
import { AttributeSetAttributesForm } from '../components/attribute-set-attributes-form'
import { useAttributes } from '../../../../../hooks/api/attributes'
import { defineRouteConfig } from '@medusajs/admin-sdk'

const AttributeSetAttributesPage = () => {
    const { id } = useParams()

    if (!id) {
        return (
            <p>Something went wrong...</p>
        )
    }

    const { attributes, isLoading } = useAttributes({
        sets: {
            id
        }
    })

    if (isLoading) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <AttributeSetAttributesForm attributeSetId={id} attributes={attributes || []}/>
    )
}

export const config = defineRouteConfig({});
  
export default AttributeSetAttributesPage
  