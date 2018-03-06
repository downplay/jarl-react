## Getting Started

To get started with a minimal routing setup in client-side React, you need three things: a route map, a history implementation, and a navigation provider.

### The Route Map

routes.js:

```js
import { RouteMapper } from "jarl-react";

const routes = new RouteMapper([
    {
        path: "/",
        staate: { page: "home" }
    },
    {
        path: "/about",
        state: { page: "about" }
    }
]);

export default routes;
```

This is a straightforward route map with two routes: a home page and an about page. The map describes the mapping between a "URL" and a "location". A location is a plain object (POJO) that should be serializable.

JARL's job is to handle that mapping for you. In your app you can deal exclusively with location objects: the current location is global state for your app, and you can use location objects to generate URLs for links.

The next task is to create a provider at the root level of our app. For now we'll use a ready-to-go provider that uses local state to track the current location (we'll look at more advanced setups later).

index.js:

```jsx
import { StateProvider } from "jarl-react";
import App from "./App";
import routes from "./routes";

// Using the history package to support browser history navigation
import createHistory from "history/createBrowserHistory";
const history = createHistory();

// The provider will render our App component and pass in the routing state!
export default () => (
    <StateProvider routes={routes} history={history} component={App} />
);
```

Finally we can now make use of the router state inside our app. JARL does not ship with components like `<Route>` that you might be used to working with on other libraries. We take the philosophy that a Route component is essentially the same a much simpler JavaScript construct: the `if` statement! Since we end up with the state as defined in our route table, we can simply react to that state: in fact here the correct construct is a `switch`.

App.js:

```jsx
import { HomePage, AboutPage } from "./pages";

// All the state values are injected straight into the App component
export default ({ screen }) => {
    switch (screen) {
        case "home":
            return <HomePage />;
        case "about":
            return <AboutPage />;
    }
};
```

And that's it! JARL keeps things very simple: there are no component APIs to learn, and you define the shape of your state however you want.

There is one piece missing of course - we can't actually navigate between the pages yet! Let's see what a Menu component will look like...

Menu.js:

```jsx
import { Link } from "jarl-react";

export default () => (
    <nav>
        <Link to={screen: "home"}>Home</Link>
        | <Link to={screen: "about"}>About</Link>
    </nav>
);
```

The `Link` component lets you use state in reverse: specify the state you want to link to, and JARL will generate the correct URL. Again, this takes advantage of the fact that state is essentially a unique identifier for a route.

Next: 02. Dynamic Routing
