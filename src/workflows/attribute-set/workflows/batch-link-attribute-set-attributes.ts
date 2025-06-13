import { LinkWorkflowInput } from "@medusajs/framework/types"
import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { batchLinkAttributeSetAttributesStep } from "../steps"

export const batchLinkAttributeSetAttributesWorkflowId = 'batch-link-attribute-set-attributes'

export const batchLinkAttributeSetAttributesWorkflow = createWorkflow(
    batchLinkAttributeSetAttributesWorkflowId,
    (input: LinkWorkflowInput) => {
        return new WorkflowResponse(batchLinkAttributeSetAttributesStep(input))
    }
)