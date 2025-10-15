import { applyDefaultFilters, authenticate, clearFiltersByKey, maybeApplyLinkFilter, MiddlewareRoute, validateAndTransformQuery } from "@medusajs/framework";
import { FeatureFlag, ProductStatus, isPresent } from "@medusajs/framework/utils";
import { StoreGetProductsParams } from "@medusajs/medusa/api/store/products/validators";
import { filterByValidSalesChannels, normalizeDataForContext, setPricingContext, setTaxContext } from "@medusajs/medusa/api/utils/middlewares/index";
import * as OriginalQueryConfig from "@medusajs/medusa/api/store/products/query-config"
import { ExtendedStoreGetProductsParams } from "./validators";
import attributeValueProduct from "../../../../../links/attribute-value-product";

// TODO: Remove once https://github.com/medusajs/medusa/pull/13714 is merged and import instead
const IndexEngineFeatureFlag = {
  key: "index_engine",
  default_val: false,
  env_key: "MEDUSA_FF_INDEX_ENGINE",
  description: "Enable Medusa to use the index engine in some part of the core",
};

export const storeAttributesProductsMiddlewares: MiddlewareRoute[] = [
    {
        method: ["GET"],
        matcher: "/store/plugin/attributes/products",
        middlewares: [
          authenticate("customer", ["session", "bearer"], {
            allowUnauthenticated: true,
          }),
          validateAndTransformQuery(
            ExtendedStoreGetProductsParams,
            OriginalQueryConfig.listProductQueryConfig
          ),
          filterByValidSalesChannels(),
          (req, res, next) => {
            const canUseIndex = !(
              isPresent(req.filterableFields.tags) ||
              isPresent(req.filterableFields.categories)
            )
            if (
              FeatureFlag.isFeatureEnabled(IndexEngineFeatureFlag.key) &&
              canUseIndex
            ) {
              return next()
            }
    
            return maybeApplyLinkFilter({
              entryPoint: "product_sales_channel",
              resourceId: "product_id",
              filterableField: "sales_channel_id",
            })(req, res, next)
          },
          applyDefaultFilters({
            status: ProductStatus.PUBLISHED,
            // TODO: the type here seems off and the implementation does not take into account $and and $or possible filters. Might be worth re working (original type used here was StoreGetProductsParamsType)
            categories: (filters: any, fields: string[]) => {
              const categoryIds = filters.category_id
              delete filters.category_id
    
              if (!isPresent(categoryIds)) {
                return
              }
    
              return { id: categoryIds, is_internal: false, is_active: true }
            },
          }),
          maybeApplyLinkFilter({
            entryPoint: attributeValueProduct.entryPoint,
            filterableField: 'attribute_value_id',
            resourceId: 'product_id'
          }),
          normalizeDataForContext(),
          setPricingContext(),
          setTaxContext(),
          clearFiltersByKey(["region_id", "country_code", "province", "cart_id"]),
        ],
      },
] 
