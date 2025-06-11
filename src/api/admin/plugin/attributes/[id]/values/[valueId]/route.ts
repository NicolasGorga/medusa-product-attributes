import { ContainerRegistrationKeys, MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils";
import { MedusaRequest, MedusaResponse, refetchEntity } from "@medusajs/framework";

import { AdminGetAttributeValueParamsType, AdminPostAttributeValueReqSchema, AdminUpdateAttributeValueType } from "../../../validators";
import { updateAttributePossibleValueWorkflow } from "../../../../../../../workflows/attribute_possible_value";

export const GET = async (req: MedusaRequest<AdminGetAttributeValueParamsType>, res: MedusaResponse) => {
    const attributeId = req.params.valueId
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [attributePossibleValue] } = await query.graph({
        entity: 'attribute_possible_value',
        ...req.queryConfig,
        filters: {
            ...req.filterableFields,
            id: attributeId
        }
    })

    if (!attributePossibleValue) {
        throw new MedusaError(MedusaErrorTypes.NOT_FOUND, `Attribute possible value with id '${attributeId}' was not found`)
    }

    return res.status(200).json({ attributePossibleValue })
}

export const POST = async (req: MedusaRequest<AdminUpdateAttributeValueType>, res: MedusaResponse) => {
    const { valueId } = req.params
    const body = req.validatedBody

    await updateAttributePossibleValueWorkflow(req.scope).run({
        input: {
            ...body,
            id: valueId
        }
    })

    const attributePossibleValue = await refetchEntity('attribute_possible_value', valueId, req.scope, req.queryConfig.fields)

    return res.status(200).json({ attributePossibleValue: attributePossibleValue })
}