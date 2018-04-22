# Redux Integration

JARL used to live alongside a small Redux integration library (it's still there but is being officially deprecated). As JARL has grown we have found its design allows it to be tightly integrated with Redux without needing an additional library to do this.

Redux integration can mean different things depending on your point of view, therefore we don't want to proscribe any one particular setup, but the simplest case would look like this. Since JARL is a controlled router, it can be driven from global state like any other Redux-connected component. You've problem written plenty of reducers like this and you have your own conventions, but here's how I would writing a routingReducer:

`actionTypes.js`:

```js
export const ROUTE_CHANGE = "ROUTE_CHANGE";
```

`actions.js`:

```js
export const routeChange = ({ location }) => ({
    type: ROUTE_CHANGE,
    location
});
```

`routingReducer.js`:

```js
// Default page is "loading" until the Redux
export const routingReducer = (state = {page: "loading"}, action) => {
    if (action.type === ROUTE_CHANGE {
        return { location: action.location };
    }
    return state;
}
```

And finally you just need to drive the RoutingProvider with the location supplied by Redux connect:

`App.js`:

```js
const renderPage = location => {
    switch (location.page) {
        case "loading":
            return "Loading...";
        case "home":
            return "HomePage";
        // etc.
    }
};

// Note: I am omitting `routes` and `history` for brevity, but routing
// will not work without them!
const App = ({ routeChange, location }) => (
    <RoutingProvider onChange={routeChange} location={location}>
        {renderPage(location)}
    </RoutingProvider>
);

// Grab the location object from the Redux store
const mapStateToProps = ({ routing }) => ({ location: routing });

// Map routeChange action for dispatch
const mapDispatchToProps = { routeChange };

// Connect up your app
export default connect(mapStateToProps, mapDispatchToProps)(App);
```

Server-side integration is also performed in a typical way; see the server-side docs, and just dispatch a routeChange action on your store before rendering.

There are a number of other patterns you could use with Redux but the open-ended and controlled component nature of JARL allow you to implement any pattern you like, or easily integration with any other global state or side-effects providers you might be using.

### redux-thunk and redux-saga

It's worth noting how to integrate with a side-effects library where you may wish to await some asynchronous operation before allowing routing to complete. This enables pre-fetch of data, authentication/authorisation, transition management, and other scenarios.

Using the `context` prop of RoutingProvider, you can inject your store's `dispatch` and `getState` functions into Route methods such as match and resolve. If you return a promise from resolve, then routing will block until the promise is resolved; this works well for redux-thunk or redux-promise. If you are using sagas, you could dispatch actions during routing for `takeEvery` sagas to act on.

`App.js`:

```js
import store from "./redux/store";
import routes from "./routes";

const App = ({ routeChange, location }) => (
    <RoutingProvider
        routes={routes}
        onChange={routeChange}
        location={location}
        context={() => ({ dispatch: store.dispatch, getState: store.getState })}
    >
        {renderPage(location)}
    </RoutingProvider>
);
```

`routes.js`

```js
import { redirect } from "jarl-react";
import { fetchProduct } from "./redux/actions";

const routes = [
    {
        // Route with preloaded data
        path: "/products/:productId",
        // Product id is matched by router, we return a Promise from a thunk
        // to fetch the data before the page loads.
        resolve: ({ productId }, { dispatch }) =>
            dispatch(fetchProduct(productId))
    },
    {
        // Authenticated route
        path: "/admin",
        // Redirect to login based on isAdmin flag in store
        match: (location, { getState }) =>
            getState().user.isAdmin ? location : redirect({ page: "login" })
    }
];
```

More examples to come, and a better sagas integration is on the roadmap ...
