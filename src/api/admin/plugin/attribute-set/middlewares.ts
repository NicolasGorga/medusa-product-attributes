import { AdminBatchLinkAttributeSetAttributes, AdminCreateAttributeSet, AdminGetAttributeSetParams, AdminGetAttributeSetsParams, AdminUpdateAttributeSet } from "./validators";
import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";

import { listAttributeSetQueryConfig, retrieveAttributeSetQueryConfig } from "./query-config";

export const adminAttributeSetMiddlewares: MiddlewareRoute[] = [
    {
        matcher: '/admin/plugin/attribute-set',
        method: ['GET'],
        middlewares: [validateAndTransformQuery(AdminGetAttributeSetsParams, listAttributeSetQueryConfig)]
    },
    {
        matcher: '/admin/plugin/attribute-set',
        methods: ['POST'],
        middlewares: [
            validateAndTransformQuery(AdminGetAttributeSetParams, retrieveAttributeSetQueryConfig),
            validateAndTransformBody(AdminCreateAttributeSet)
        ]
    },
    {
        matcher: '/admin/plugin/attribute-set/:id',
        method: ['GET'],
        middlewares: [
            validateAndTransformQuery(AdminGetAttributeSetParams, retrieveAttributeSetQueryConfig)
        ]
    },
    {
        matcher: '/admin/plugin/attribute-set/:id',
        method: ['POST'],
        middlewares: [
            validateAndTransformQuery(AdminGetAttributeSetParams, retrieveAttributeSetQueryConfig),
            validateAndTransformBody(AdminUpdateAttributeSet)
        ]
    },
    {
        matcher: '/admin/plugin/attribute-set/:id/attributes',
        method: ['POST'],
        middlewares: [
            validateAndTransformBody(AdminBatchLinkAttributeSetAttributes)
        ]
    }
]