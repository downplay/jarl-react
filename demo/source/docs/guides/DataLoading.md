# Data Loading

Most of the time in a real application, every route carries with it some data requirements.
Normally in the React world we're encouraged to manage an `isLoading` flag in state and
display some loading spinner while the data loads. This solution isn't ideal because we
have to manage and check that flag everywhere. JARL makes it easy to manage your loading
state at the router level rather than the component level.

Let's take the previous example of a product page and see how this looks once we move the side-effects (actually loading the data) into our route map, using `resolve` on our routes.

routes.js:

```js
import { RouteMap } from "jarl-react";

const routes = new RouteMap([
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/products/:productId",
        state: { page: "product" },
        resolve: async ({ productId }) => {
            const result = await fetch(`/api/products/${productId}`);
            const product = await result.json();
            return { product };
        }
    }
]);

export default routes;
```

By initiating data loads during routing, we can ensure that data is available _before_ switching routes and updating the page. JARL will wait for the Promise returned by our async function to resolve before updating the navigation state.

## Rejecting routes

Handling data in our routes table provides some additional benefits. One of these is that we can reject the route by rejecting the promise. Consider this example:

```js
import { RouteMap } from "jarl-react";

const routes = new RouteMap([
    {
        path: "/",
        state: { page: "home" }
    },
    {
        path: "/products/:productSlug",
        state: { page: "product" },
        resolve: async ({ productSlug }) => {
            const response = await fetch(
                `/api/productsBySlug?slug=${productSlug}`
            );
            if (!response.ok) {
                return Promise.reject("Not found");
            }
            const product = await response.json();
            return { product };
        }
    },
    {
        path: "/products/:productSlug",
        state: { page: "productSearch", notFound: true },
        resolve: async ({ productSlug }) => {
            const response = await fetch(
                `/api/productSearch?text=${productSlug.replace(" ", "")}`
            );
            const products = await response.json();
            return { products };
        }
    }
]);

export default routes;
```
