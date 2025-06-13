import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";
import { AdminCreateAttribute, AdminCreateAttributeValue, AdminGetAttributeParams, AdminGetAttributesParams, AdminGetAttributeValueParams, AdminGetAttributeValuesParams, AdminUpdateAttribute, AdminUpdateAttributeValue } from "./validators";
import * as QueryConfig from './query-config'
import { adminAttributesRoutePath } from "../../../utils/constants";

export const adminAttributeRoutesMiddlewares: MiddlewareRoute[] = [
    {
        method: ['GET'],
        matcher: adminAttributesRoutePath,
        middlewares: [
            validateAndTransformQuery(
                AdminGetAttributesParams,
                QueryConfig.listAttributeQueryConfig,
            )
        ]
    },
    {
        method: ['POST'],
        matcher: adminAttributesRoutePath,
        middlewares: [
            validateAndTransformBody(AdminCreateAttribute),
            validateAndTransformQuery(
                AdminGetAttributeParams,
                QueryConfig.retrieveAttributeQueryConfig
            )
        ]
    },
    {
        method: ['GET'],
        matcher: `${adminAttributesRoutePath}/:id`,
        middlewares: [
            validateAndTransformQuery(
                AdminGetAttributeParams,
                QueryConfig.retrieveAttributeQueryConfig
            )
        ]
    },
    {
        method: ['POST'],
        matcher: `${adminAttributesRoutePath}/:id`,
        middlewares: [
            validateAndTransformBody(AdminUpdateAttribute),
            validateAndTransformQuery(
                AdminGetAttributeParams,
                QueryConfig.retrieveAttributeQueryConfig
            )
        ]
    },
    {
        method: ['GET'],
        matcher: `${adminAttributesRoutePath}/:id/values`,
        middlewares: [
            validateAndTransformQuery(
                AdminGetAttributeValuesParams,
                QueryConfig.listAttributeValueQueryConfig,
            )
        ]
    },
    {
        method: ['POST'],
        matcher: `${adminAttributesRoutePath}/:id/values`,
        middlewares: [
            validateAndTransformBody(AdminCreateAttributeValue),
            validateAndTransformQuery(
                AdminGetAttributeValueParams,
                QueryConfig.retrieveAttributeValueQueryConfig,
            )
        ]
    },
    {
        method: ['GET'],
        matcher: `${adminAttributesRoutePath}/:id/values/:valueId`,
        middlewares: [
            validateAndTransformQuery(
                AdminGetAttributeValueParams,
                QueryConfig.retrieveAttributeValueQueryConfig
            )
        ]
    },
    {
        method: ['POST'],
        matcher: `${adminAttributesRoutePath}/:id/values/:valueId`,
        middlewares: [
            validateAndTransformBody(AdminUpdateAttributeValue),
            validateAndTransformQuery(
                AdminGetAttributeValueParams,
                QueryConfig.retrieveAttributeValueQueryConfig
            )
        ]
    }
]