import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { UpdateAttributeDTO } from "../../../modules/attribute/types/attribute/common";
import { updateAttributesStep } from "../steps";
import { LinkDefinition } from "@medusajs/framework/types";
import { ATTRIBUTE_MODULE } from "../../../modules/attribute";
import { arrayDifference, Modules } from "@medusajs/framework/utils";
import { createRemoteLinkStep, dismissRemoteLinkStep, emitEventStep, useQueryGraphStep, useRemoteQueryStep } from "@medusajs/medusa/core-flows";
import attributeProductCategory from "../../../links/attribute-product-category";
import { AttributeWorkflowsEvents } from "../../../modules/attribute/events";

const updateAttributesWorkflowId = "update-attributes";

export type UpdateAttributesWorkflowInput = {
  attributes: UpdateAttributeDTO[];
};

export const updateAttributesWorkflow = createWorkflow(
  updateAttributesWorkflowId,
  (input: UpdateAttributesWorkflowInput) => {
    const toUpdateInput = transform({ input }, ({ input: { attributes } }) => {
      return attributes.map((attribute) => ({
        ...attribute,
        product_category_ids: undefined,
      }));
    });

    const updatedAttributes = updateAttributesStep(toUpdateInput);

    const attributesIdsWithCategories = transform({ input, updatedAttributes }, ({ input, updatedAttributes }) => {
        const updatedAttributeIds = updatedAttributes.map(attr => attr.id)
        const attributeIdsWithoutCategories = input.attributes
            .filter(attr => !attr.product_category_ids)
            .map(attr => attr.id)
        return arrayDifference(updatedAttributeIds, attributeIdsWithoutCategories)
    })

    const currentCategoriesLinksResult = useQueryGraphStep({
      entity: attributeProductCategory.entryPoint,
      fields: ["attribute_id", "product_category_id"],
        filters: {
          attribute_id: attributesIdsWithCategories,
        },
    });

    const currentCategoriesLinks = transform({ currentCategoriesLinksResult }, ({ currentCategoriesLinksResult }) => {
        return currentCategoriesLinksResult.data
    })

    const toDeleteCategoriesLinks = transform({ currentCategoriesLinks }, ({ currentCategoriesLinks }) => {
        if (!currentCategoriesLinks.length) {
            return []
        }

        return currentCategoriesLinks.map(({ attribute_id, product_category_id }) => ({
            [ATTRIBUTE_MODULE]: {
                attribute_id
            },
            [Modules.PRODUCT]: {
                product_category_id
            }
        }))
    })

    dismissRemoteLinkStep(toDeleteCategoriesLinks)

    const toCreateCategoryLinks: LinkDefinition[] = transform(
      { input },
      ({ input: { attributes }}) => {
        return attributes
          .filter((attribute) => attribute.product_category_ids)
          .flatMap((attribute) =>
            attribute.product_category_ids!.map((attrCat) => ({
              [ATTRIBUTE_MODULE]: {
                attribute_id: attribute.id,
              },
              [Modules.PRODUCT]: {
                product_category_id: attrCat,
              },
            }))
          );
      }
    )

    const updatedAttributesEventData = transform({ updatedAttributes }, ({ updatedAttributes }) => 
        updatedAttributes.map(attr => attr.id)
    )

    parallelize(
        createRemoteLinkStep(toCreateCategoryLinks),
        emitEventStep({
            eventName: AttributeWorkflowsEvents.UPDATED,
            data: updatedAttributesEventData
        })
    )

    return new WorkflowResponse(updatedAttributes)
  }
);
