import Medusa from "@medusajs/js-sdk"

export const medusaClient = new Medusa({
  baseUrl: __BACKEND_URL__,
  auth: {
    type: 'session'
  }
}) 