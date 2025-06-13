import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CreateAttributeStepInput } from "../../../modules/attribute/types/attribute/common"
import AttributeModuleService from "../../../modules/attribute/service"
import attribute, { ATTRIBUTE_MODULE } from "../../../modules/attribute"
import { kebabCase, toHandle } from "@medusajs/framework/utils"

export const createAttributesStepId = 'create-attributes'

export const createAttributesStep = createStep(
    createAttributesStepId,
    async (data: CreateAttributeStepInput, { container }) => {
        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        const validated = data.map(attribute => {
            let result = { ...attribute }
            if (!attribute.handle) {
                result.handle = toHandle(attribute.name)
            }
            return result
        })

        //@ts-expect-error
        const created = await service.createAttributes(validated) as any[]
        return new StepResponse(created, created.map(attribute => attribute.id))
    },
    async (createdIds: string[] | undefined, { container }) => {
        if(!createdIds?.length) {
            return
        }

        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        await service.deleteAttributes(createdIds)
    }
)