import { MedusaRequest, MedusaResponse, refetchEntities } from "@medusajs/framework";
import { AdminGetAttributeParamsType, AdminUpdateAttributeType } from "../validators";
import { ContainerRegistrationKeys, MedusaError, MedusaErrorTypes } from "@medusajs/framework/utils";
import { updateAttributesWorkflow } from "../../../../../workflows";
import { UpdateAttributeDTO } from "../../../../../modules/attribute/types/attribute/common";
import { deleteAttributeWorkflow } from "../../../../../workflows/attribute/workflows/delete-attribute";

export const POST = async (req: MedusaRequest<UpdateAttributeDTO>, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const attributeId = req.params.id

    const { data: [existingAttribute] } = await query.graph({
        entity: 'attribute',
        fields: ['id'],
        filters: {
            id: attributeId
        }
    })

    if (!existingAttribute) {
        throw new MedusaError(MedusaErrorTypes.NOT_FOUND, `Attribute with id '${attributeId}' not found`)
    }

    await updateAttributesWorkflow(req.scope).run({
        input: { attributes: [{
            ...req.validatedBody,
            id: attributeId
        }] }
    })

    const attribute = await refetchEntities(
        'attribute',
        attributeId,
        req.scope,
        req.queryConfig.fields
    )

    return res.status(201).json({ attribute })
}

export const GET = async (req: MedusaRequest<AdminGetAttributeParamsType>, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const attributeId = req.params.id

    const { data: [attribute] } = await query.graph({
        entity: 'attribute',
        ...req.queryConfig,
        filters: {
            id: attributeId,
        },
    })

    if (!attribute) {
        throw new MedusaError(MedusaErrorTypes.NOT_FOUND, 'Attribute not found')
    }

    return res.status(200).json({ attribute })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const attributeId = req.params.id 
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [attribute] } = await query.graph({
        entity: 'attribute',
        fields: ['id'],
        filters: {
            id: attributeId,
        },
    })

    if (!attribute) {
        throw new MedusaError(MedusaErrorTypes.NOT_FOUND, 'Attribute not found')
    }

    await deleteAttributeWorkflow(req.scope).run({
        input: {
            id: attributeId
        }
    })

    return res.status(200).json({})
}