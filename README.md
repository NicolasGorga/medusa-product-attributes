# @nicogorga/medusa-product-attributes

Create global (category specific) product attributes on your Medusa commerce application

> [!WARNING]
> This plugin is a WIP and I am working on it in my spare time between projects and work. Feel free to make contributions by making pull requests and proposing ideas / new flows to implement via [Discussions](https://github.com/NicolasGorga/medusa-product-attributes/discussions)
> If this helps you, you can buy me a :coffee: or reach out to me if you need help with your MedusaJS projects :wink:

## Compatibility

This plugin is compatible with versions >= 2.6.1 of `@medusajs/medusa`. 

## Progress 

All the progress is recorded in CHANGELOG.md and so far, it is solely focused on backend (you can use the functionallities via API calls)

## Roadmap

- Create Admin panel widgets link attribute values to products

## Prerequisites

- [Node.js v20 or greater](https://nodejs.org/en)
- [A Medusa backend](https://docs.medusajs.com/learn/installation)

## How to Install

1\. Run the following command in the directory of the Medusa backend using your package manager (for example for npm):

  ```bash
  npm install @nicogorga/medusa-product-attributes
  ```

2\. In `medusa-config.ts` add the following at the end of the `plugins` array in your project config object:

  ```js
  projectConfig: {
    plugins = [
    // ...
    {
      resolve: `@nicogorga/medusa-product-attributes`,
    },
  ]
  }
  ```

3\. In your already existent or new createProductsWorkflow.productsCreated hook handler, import `productsCreatedHookHandler` and call it like following. This is important as it's what links new products to the requested attribute values (if any):

```js
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import { productsCreatedHookHandler } from "@nicogorga/medusa-product-attributes/utils/products-created-handler"

createProductsWorkflow.hooks.productsCreated(
    async ({ products, additional_data }, { container }) => {
      const links = await productsCreatedHookHandler({ products, additional_data, container })

      // Your own logic (if any). You can return 'links' to your compensation function, to dismiss the links if an error occurs
    }
)
```

4\. In your already existent or new updateProductsWorkflow.productsUpdated hook handler, import `productUpdatedHookHandler` and call it like following. This is important as it's what updated the porduct attributes, with the requested attribute values (if any):

```js
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import { productsUpdatedHookHandler } from "@nicogorga/medusa-product-attributes/utils/products-updated-handler"

updateProductsWorkflow.hooks.productsUpdated(
    async ({ products, additional_data }, { container }) => {
      const links = await productsUpdatedHookHandler({ products, additional_data, container })

      // Your own logic (if any). You can return 'links' to your compensation function, to dismiss the links if an error occurs
    }
)
```

## Additional Resources

- [medusa-custom-attributes v1](https://github.com/vholik/medusa-custom-attributes)
Props to [Viktor Holik](https://github.com/vholik), the creator, for his work as it is a great reference and has proved to be open to help
- Github Discussions
  - [Global / Category Based Product Options](https://github.com/medusajs/medusa/discussions/11910)
  - [Global variant options and variant generator](https://github.com/medusajs/medusa/discussions/5119)