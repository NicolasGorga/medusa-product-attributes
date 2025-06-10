import { createAttributeValueWorkflow, deleteAttributeValueWorkflow } from "../workflows/attribute-value/workflow";

import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { MedusaContainer } from "@medusajs/framework";
import { ProductAttributeValueDTO } from "../types/attribute";
import { ProductDTO } from "@medusajs/framework/types";
import attributeValueProduct from "../links/attribute-value-product";
import { validateAttributeValuesToLink } from "./validate-attribute-values-to-link";

export const productsUpdatedHookHandler = async ({
  products,
  additional_data,
  container,
}: {
  products: ProductDTO[];
  additional_data: Record<string, unknown> | undefined;
  container: MedusaContainer;
}) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  const attributeValues = (additional_data?.values ?? []) as ProductAttributeValueDTO[];
  const productIds = products.map((prod) => prod.id);

  if (!attributeValues.length) {
    return [];
  }

  const updatedValueIds = (await Promise.all(productIds.map(async prodId => {
    const { data: productValues } = await query.graph({
      entity: attributeValueProduct.entryPoint,
      fields: ['attribute_value.id', 'attribute_value.value'],
      filters: {
        product_id: prodId
      }
    })

    return Promise.all(attributeValues.map(async attrVal => {
      const existentProductValue = productValues.find(prodVal => prodVal.attribute_value.value === attrVal.value)
      if (existentProductValue) {
        return existentProductValue.attribute_value.id as string
      }

      const { result } = await createAttributeValueWorkflow(container).run({
        input: {
          attribute_id: attrVal.attribute_id,
          value: attrVal.value,
          product_id: prodId,
        }
      })
      return result.id
    }))
  }))).flat()

  const { data } = await query.graph({
    entity: attributeValueProduct.entryPoint,
    fields: ['attribute_value_id'],
    filters: {
      attribute_value_id: {
        $nin: updatedValueIds
      },
      product_id: productIds
    }
  })

  if (!data.length) {
    return;
  }
  
  await deleteAttributeValueWorkflow(container).run({
    input: data.map(val => val.attribute_value_id)
  })
}; 
