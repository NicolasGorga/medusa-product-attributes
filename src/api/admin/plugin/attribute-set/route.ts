import { MedusaRequest, MedusaResponse, refetchEntity } from "@medusajs/framework";

import { AdminCreateAttributeSetType, AdminGetAttributesSetsParamsType } from "./validators";
import { createAttributeSetWorkflow } from "../../../../workflows/attribute-set/workflows/create-attribute-set";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const POST = async (req: MedusaRequest<AdminCreateAttributeSetType>, res: MedusaResponse) => {
    const { result: [attributeSet] } = await createAttributeSetWorkflow(req.scope).run({
        input: [req.validatedBody]
    })

    const response = await refetchEntity(
        'attribute_set',
        attributeSet.id,
        req.scope,
        req.queryConfig.fields,
    )
    
    return res.status(201).json({ attribute_set: response })
}

export const GET = async (req:MedusaRequest<AdminGetAttributesSetsParamsType>, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: attributeSets, metadata } = await query.graph({
        entity: 'attribute_set',
        filters: req.filterableFields,
        ...req.queryConfig
    })

    return res.status(200).json({ attributeSets, count: metadata?.count, offset: metadata?.skip, limit: metadata?.take })
}