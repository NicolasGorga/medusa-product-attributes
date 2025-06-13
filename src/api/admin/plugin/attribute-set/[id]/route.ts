import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { AdminGetAttributeParamsType } from "../../attributes/validators";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

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