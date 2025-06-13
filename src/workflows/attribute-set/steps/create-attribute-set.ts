import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

import { ATTRIBUTE_MODULE } from "../../../modules/attribute"
import AttributeModuleService from "../../../modules/attribute/service"
import { CreateAttributeSetDTO } from "../../../modules/attribute/types"
import { kebabCase, toHandle } from "@medusajs/framework/utils"

export const createAttributeSetStepId = 'create-attribute-set'

export const createAttributeSetStep = createStep(
    createAttributeSetStepId,
    async (input: CreateAttributeSetDTO | CreateAttributeSetDTO[], { container }) => {
        const attributeModuleService = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        const normalizedInput = Array.isArray(input) ? input : [input]

        const toCreate = normalizedInput.map(attributeSet => ({
            ...attributeSet,
            handle: attributeSet.handle?.length ? attributeSet.handle : toHandle(attributeSet.name)
        }))

        const created = await attributeModuleService.createAttributeSets(toCreate)

        return new StepResponse(created, created.map(set => set.id))
    },
    async (ids: string[] | undefined, { container }) => {
        if (!ids?.length) {
            return
        }

        const attributeModuleService = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)
        await attributeModuleService.deleteAttributeSets(ids)
    }
)