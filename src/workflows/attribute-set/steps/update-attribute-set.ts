import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { AdminUpdateAttributeSetType } from "../../../api/admin/plugin/attribute-set/validators"
import AttributeModuleService from "../../../modules/attribute/service"
import { ATTRIBUTE_MODULE } from "../../../modules/attribute"

export const updateAttributeStepId = 'update-attribute-set'

type UpdateAttributeStepInput = AdminUpdateAttributeSetType & { id: string }

export const updateAttributeSetStep = createStep(
    updateAttributeStepId,
    async (data: UpdateAttributeStepInput, { container }) => {
        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        const prev = await service.retrieveAttributeSet(data.id)
        const updated = await service.updateAttributeSets(data)

        return new StepResponse(updated, prev)
    },
    async (prev, { container }) => {
        if (!prev) {
            return 
        }
        
        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        await service.updateAttributeSets({
            ...prev,
            attributes: prev.attributes.map(attr => attr.id)
        })
    }
)