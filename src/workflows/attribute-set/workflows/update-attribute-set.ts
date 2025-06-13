import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { AdminUpdateAttributeSetType } from "../../../api/admin/plugin/attribute-set/validators"
import { updateAttributeSetStep } from "../steps"

export const updateAttributeWorkflowId = 'update-attribute-set'

type UpdateAttributeSetWorkflowInput = AdminUpdateAttributeSetType & { id: string }

export const updateAttributeSetWorkflow = createWorkflow(
    updateAttributeWorkflowId,
    (input: UpdateAttributeSetWorkflowInput) => {
        return new WorkflowResponse(updateAttributeSetStep(input))
    }
)