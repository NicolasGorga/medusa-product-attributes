import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { AdminBatchLinkAttributeSetAttributesType } from "../../validators";
import { batchLinkAttributeSetAttributesWorkflow } from "../../../../../../workflows/attribute-set/workflows";

export const POST = async (req: MedusaRequest<AdminBatchLinkAttributeSetAttributesType>, res: MedusaResponse) => {
    const attributeSetId = req.params.id
    const payload = req.validatedBody

    await batchLinkAttributeSetAttributesWorkflow(req.scope).run({
        input: {
            ...payload,
            id: attributeSetId
        }
    })

    return res.status(200).json({})
}