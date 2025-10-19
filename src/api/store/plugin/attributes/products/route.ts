// TODO: This is messy, but since Medusa doesn't allow to extend Core GET routes
// params validators, the only way i see to query core routes with linked
// custom modules entities, is to recreate route (in a custom one) middleware and
// apply the custom params validator

import { MedusaResponse } from "@medusajs/framework";
import { HttpTypes } from "@medusajs/framework/types";
import { isPresent, ContainerRegistrationKeys, remoteQueryObjectFromString } from "@medusajs/framework/utils";
import { RequestWithContext, wrapProductsWithTaxPrices } from "@medusajs/medusa/api/store/products/helpers";
import { wrapVariantsWithInventoryQuantityForSalesChannel } from "@medusajs/medusa/api/utils/middlewares/index";
import { ExtendedStoreGetProductsParamsType } from "./validators";

export const GET = async (
  req: RequestWithContext<ExtendedStoreGetProductsParamsType>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) => {
  return await getProducts(req as any, res);
};

async function getProducts(
  req: RequestWithContext<HttpTypes.StoreProductListParams>,
  res: MedusaResponse<HttpTypes.StoreProductListResponse>
) {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY);
  const context: object = {};
  const withInventoryQuantity = req.queryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  );

  if (withInventoryQuantity) {
    req.queryConfig.fields = req.queryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    );
  }

  if (isPresent(req.pricingContext)) {
    context["variants.calculated_price"] = {
      context: req.pricingContext,
    };
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
      ...context,
    },
    fields: req.queryConfig.fields,
  });

  const { rows: products, metadata } = await remoteQuery(queryObject);

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantityForSalesChannel(
      req,
      products.map((product) => product.variants).flat(1)
    );
  }

  await wrapProductsWithTaxPrices(req, products);
  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  });
}
