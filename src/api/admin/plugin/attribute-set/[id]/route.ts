import { MedusaRequest, MedusaResponse, refetchEntity } from "@medusajs/framework";
import { AdminGetAttributeParamsType } from "../../attributes/validators";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateAttributeSetWorkflow } from "../../../../../workflows/attribute-set/workflows";
import { AdminUpdateAttributeSetType } from "../validators";

export const GET = async (req: MedusaRequest<AdminGetAttributeParamsType>, res: MedusaResponse) => {
    const id = req.params.id
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [attributeSet] } = await query.graph({
        entity: 'attribute_set',
        filters: { id }, 
        ...req.queryConfig,
    }, {
        throwIfKeyNotFound: true,
    })

    return res.status(200).json({ attributeSet })
}

export const POST = async (req: MedusaRequest<AdminUpdateAttributeSetType>, res: MedusaResponse) => {
    const id = req.params.id
    const body = req.validatedBody

    await updateAttributeSetWorkflow(req.scope).run({
        input: {
            ...body,
            id,
        }
    })

    const attributeSet = await refetchEntity(
        'attribute_set',
        id,
        req.scope,
        req.queryConfig.fields,
    )

    return res.status(200).json({ attributeSet })
}