import { AdminCreateAttributeSet, AdminGetAttributeSetParams, AdminGetAttributeSetsParams } from "./validators";
import { MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";

import { listAttributeSetQueryConfig, retrieveAttributeSetQueryConfig } from "./query-config";

export const adminAttributeSetMiddlewares: MiddlewareRoute[] = [
    {
        matcher: 'admin/plugin/attribute-set',
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
    }
]