import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ATTRIBUTE_MODULE } from "../../../modules/attribute"
import AttributeModuleService from "../../../modules/attribute/service"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const deleteAttributeStepId = 'delete-attribute-step'

type DeleteAttributeStepInput = {
    id: string
}

export const deleteAttributeStep = createStep(
    deleteAttributeStepId,
    async ({ id }: DeleteAttributeStepInput, { container }) => {
        const attributeModuleService = container.resolve(ATTRIBUTE_MODULE) as AttributeModuleService
        const link = container.resolve(ContainerRegistrationKeys.LINK)
        
        await attributeModuleService.softDeleteAttributes(id)
        await link.delete({
            [ATTRIBUTE_MODULE]: {
                attribute_id: id,
            }
        })
        return new StepResponse(undefined, id)
    },
    async (id: string | undefined, { container }) => {
        if (!id) {
            return
        }

        const attributeModuleService = container.resolve(ATTRIBUTE_MODULE) as AttributeModuleService
        const link = container.resolve(ContainerRegistrationKeys.LINK)
        
        await attributeModuleService.restoreAttributes(id)
        await link.restore({
            [ATTRIBUTE_MODULE]: {
                attribute_id: id
            }
        })
    }
)