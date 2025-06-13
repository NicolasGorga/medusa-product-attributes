import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { AdminBatchLinkAttributeSetAttributesType } from "../../../api/admin/plugin/attribute-set/validators"
import AttributeModuleService from "../../../modules/attribute/service"
import { ATTRIBUTE_MODULE } from "../../../modules/attribute"
import { LinkWorkflowInput } from "@medusajs/framework/types"

export const batchLinkAttributeSetAttributesStepId = 'batch-link-attribute-set-attributes'

export const batchLinkAttributeSetAttributesStep = createStep(
    batchLinkAttributeSetAttributesStepId,
    async (data: LinkWorkflowInput, { container }) => {
        if (!data.add?.length && !data.remove?.length) {
            return new StepResponse(void 0, null)
        }

        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        const toRemoveAttributesSet = new Set(data.remove?.map(id => id))
        const targetAttributes = await service.listAttributes({
            id: [...(data?.add ?? []), ...(data?.remove ?? [])] 
        }, {
            select: ['id'],
            relations: ['sets']
        })

        const attributesWithUpdateSets = targetAttributes.map(attribute => {
            if (toRemoveAttributesSet.has(attribute.id)) {
                return {
                    id: attribute.id,
                    sets: (attribute.sets ?? [])
                        .filter(attrSet => attrSet.id !== data.id)
                        .map(attrSet => attrSet.id)
                }
            }

            return {
                id: attribute.id,
                sets: [...(attribute.sets ?? []).map(attrSet => attrSet.id), data.id]
            }
        }) as { id: string, sets: string[]}[]

        await service.updateAttributes(attributesWithUpdateSets)

        return new StepResponse(void 0, {
            ...data,
            attribute_ids: attributesWithUpdateSets.map(attr => attr.id)
        })
    },
    async (data: (LinkWorkflowInput & { attribute_ids: string[] }) | null, { container }) => {
        if(!data?.add || !data?.remove) {
            return
        }

        const service = container.resolve<AttributeModuleService>(ATTRIBUTE_MODULE)

        const toRevertAttributeSet = new Set(data?.remove?.map(id => id))
        const targetAttributes = await service.listAttributes({
            id: data.attribute_ids,
        }, {
            select: ['id'],
            relations: ['sets']
        })
      
        const attributesWithRevertedSets = targetAttributes.map(attribute => {
            if (toRevertAttributeSet.has(attribute.id)) {
                return {
                    id: attribute.id,
                    sets: [...(attribute.sets ?? []).map(attrSet => attrSet.id), data.id]
                }
            }

            return {
                id: attribute.id,
                sets: (attribute.sets ?? [])
                    .filter(attrSet => attrSet.id !== data.id)
                    .map(attrSet => attrSet.id)
            }
        }) as { id:string, sets: string[]}[]

        await service.updateAttributes(attributesWithRevertedSets)
    }
)