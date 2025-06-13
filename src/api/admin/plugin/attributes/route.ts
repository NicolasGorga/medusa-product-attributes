import { MedusaRequest, MedusaResponse, refetchEntities, refetchEntity } from "@medusajs/framework";
import { AdminCreateAttributeType, AdminGetAttributesParamsType } from "./validators";
import { createAttributesWorkflow } from "../../../../workflows";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest<AdminGetAttributesParamsType>, res: MedusaResponse) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    // TODO: check why, even though *product_categories is in default fields
    // only the id is returned for each category
    const { data: attributes, metadata } = await query.graph({
        entity: 'attribute',
        filters: req.filterableFields,
        ...req.queryConfig
    })
    return res.status(200).json({ attributes, count: metadata?.count, offset: metadata?.skip, limit: metadata?.take })
}

export const POST = async (req: MedusaRequest<AdminCreateAttributeType>, res: MedusaResponse) => {
    const attributeDto = req.validatedBody

    const { result } = await createAttributesWorkflow(req.scope).run({
        input: { attributes: [attributeDto] },
    })

    const attribute = await refetchEntity(
        'attribute',
        result[0].id,
        req.scope,
        req.queryConfig?.fields ?? []
    )

    res.status(201).json({ attribute })
}