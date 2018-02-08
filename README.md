# jarl-react 0.5.x

Just Another Router Library for React.

## Philosophy

* URLs are a public API into your appplication
* Routes define a mapping between URL and state
* Routing is a core part of your application logic
* A router should not dictate state mechanism nor navigation lifecycle
* Data dependencies are closely bound to routes

Putting all of this together, I wanted a router that performs the simple-sounding
task of keeping the URL and the state in sync, whilst not getting in the way
of application structure, and not requiring learning a component API for
basic conditional rendering tasks. For example, JARL does not have a `Route`
component: you can simply inspect your state and render using `if` and `switch`.

Routes are described using simple serializable state objects. The route table is then a
mapping between URLs and these objects. This provides some key benefits:

* The state can be stored in Redux, local state, or any other storage mechanism,
  and used for making any rendering decisions
* URLs don't ever need to be used inside your application, instead Link can build
  its URL from state objects, making it very easy to tweak your route structure at any time
* React Native support becomes very easy since we can drop the URLs entirely and everything still works!

Some examples of state mapping:

`/about` -> `{page: "about"}`
`/product/:productId` -> `{page: "product", productId: <string>}`

All routing can be described using this simple approach.

## Concrete Example

Add to your project:

```
yarn add jarl-react
```

Declare a routing table:

```js
const routes = [
    // Home page route
    {
        path: "/",
        // Model the state however you want!
        // Here we decided to use a `page` property to
        // switch between pages:
        state: { page: "home" }
    },
    // Another static page
    {
        path: "/about",
        state: { page: "about" }
    },
    // A dynamic URL for viewing products
    {
        path: "/products/:productId",
        // The `productId` property be merged into state when the
        // route matches
        state: { page: "product" },
        // Nested child routes are straightforward:
        routes: [
            {
                path: "/comments",
                // All the state will be merged down the branch,
                // so we'll end up with the following:
                // { page: "product", productId: <id>, tab: "comments" }
                state: { tab: "comments" }
            }
        ]
    },
    // Dynamic (and in brackets for optional) query parameters:
    {
        path: "/search?q=:search&sort=(:sortKey)",
        state: { page: "search" }
    },
    // Finally a catch-all `*` route for any bad URLs...
    {
        path: "/*:missingPath",
        state: { page: "404" }
    }
];
```

Load the routes and a `history` implementation of your choice into your `NavigationProvider`:

```js
const history = createBrowserHistory();
ReactDOM.render(
    <NavigationProvider history={history} routes={routes}>
        <App />
    </NavigationProvider>,
    rootElement
);
```

(See [history] package for `createBrowserHistory` and more!)

And finally in your `App` component you can inject the state to perform the actual routing:

```js
import { withLocation } from "jarl-react";

// All our possible state variables are made available in the App
const App = ({ page, productId, search, sortKey, tab, missingPath }) => {
    // Our routing is just one big switch statement - no component needed!
    switch (page) {
        case "home":
            return <HomePage />;
        case "about":
            return <AboutPage />;
        case "product":
            // Inside ProductPage we'll have a similar switch or some other
            // conditional to maybe render a tab...
            return <ProductPage productId={productId} tab={tab} />;
        case "search":
            return <SearchPage search={search} sortKey={sortKey} />;
        case "404":
            return <MissingPage path={missingPath} />;
    }
};

// State is actually injected into App using the `withLocation` higher-order component
export default withLocation()(App);
```

Wait, we missed something! How do you actually link to a page? JARL has a Link component much like other router libraries, but its unique feature is that we can actually generate URLs from exactly the same state objects as specified in our routing table. Your main menu might look like this:

```js
import { Link } from "jarl-react";

const MainMenu = () => (
  <nav>
    <Link to={ page: "home" }>Home</Link>
    <Link to={ page: "about" }>About</Link>
    <Link to={ page: "product", productId: 123 }>Our Best Product Ever!</Link>
    <SearchForm />
  </nav>
)
```

These links will use the routing table in reverse to stringify all the correct URLs to your pages, e.g. the product link will become `<a href="/product/123">`.

The `SearchForm` component needs to handle links in a slightly different way, as it needs to programmatically navigate to the search page. It looks like this:

```js
// The `withNavigate` HOC will inject a function we can use for navigation
import { withNavigate } from "jarl-react";

class SearchForm extends React.Component {
    state = { searchText: "" };

    handleChange = (e) => {
        // Standard controlled input state management
        this.setState({searchText: e.target.value});
    }

    handleSearch = () => {
        // Navigate function has been injected into props. Just pass it another state
        // object -- JARL will figure out the correct URL, i.e. `/search?q=some%20text`
        this.props.navigate({ page: "search", search: this.state.searchText });
    }

    render() {
        <form>
            <input type="text" value={this.state.searchText} onChange={this.handleChange} placeholder="Enter search term" />
            <button onClick={this.handleSearch}>Search</button>
        </form>
    }
)

// Export class and decorate with the HOC
export default withNavigate()(SearchForm);
```

That's all the basics! Hopefully this gave a flavour of the power and simplicity of this routing system. More advanced demos (such as data preloading, state mapping, Redux integration) will be showcased in the demo site...

## Latest release, status, roadmap

`0.5.0` marked an important milestone - JARL is getting very close to feature
completeness! This release brings a slew of new features: notably query string
support, new properties `basePath` and `performInitialNavigation` on the `NavigationProvider`,
and a new `withContext` HOC to gain access to JARL's `stringify` function.

What is left to do before the version can become 1.0.0-alpha? The main points are:

* Documentation and demos. The current set of demos (and E2E tests) show off many features and
  scenarios but there is plenty missing, and documentation is drastically incomplete.
* Redirects and authorisation on routes
* Integrations:
    * React Native (probably just needs an alternate Link component)
    * Improve support for Redux, perhaps enabling navigation via dispatch, consider Saga support
* Fix isActive to work on partial paths / query strings
* A couple of new components: function-as-child versions of withLocation and Link
* Figure out how to support animated transitions (but maybe leave this until after 1.0.0)
* Optional path segments. The `url-pattern` syntax supports this but JARL doesn't
* Query strings: support nesting and arrays. We use `qs` to parse query strings, it supports an advanced syntax for nesting and arrays, but this is not understood by matching or stringification.
* Query strings: support compound interpolations for optional query keys. This means multiple interpolations on a single token, a good example might be: `/range?start=(:startYear-:startMonth-:startDay)&end=(:endYear-:endMonth-:endDay)`. This will not work and is pretty hard to support right now.
* Publish demos somewhere!

This might look a lot but we're really not far off! And much of this is "nice to have". My priority right now is getting some good documentation written so people can actually use this.

## Documentation

Lack of documentation is the biggest reason you shouldn't use this router right now. If you want to see some detail examples, take a look through the source code of the demos:
https://github.com/downplay/jarl-react/tree/master/demo/source/demos

## Tests & Demos

```
git clone https://github.com/downplay/jarl-react
cd jarl-react
yarn
```

To run unit tests:

```
yarn test
```

To run demo:

```
yarn demo
```

To run e2e tests (using [cypress.io](https://cypress.io)):

```
yarn e2e
```

## Credits

Pattern matching by `url-pattern`: https://github.com/snd/url-pattern (MIT license)

(Currently using custom build at this fork: https://github.com/downplay/url-pattern)

Query string parsing by `qs`: https://github.com/ljharb/qs

Some ideas and inspiration from `redux-first-router`: https://github.com/faceyspacey/redux-first-router

And to some extent the [Autoroute](http://www.davidhayden.me/blog/autoroute-custom-patterns-and-route-regeneration-in-orchard-1.4) feature of Orchard CMS, which I was a contributor to many moons ago ;)

Recommended browser history abstractions by `history`: https://github.com/ReactTraining/history

## Version History

### Next

* Added a half-decent example to the README

### 0.6.0

* Now supports `match` and `stringify` functions on routes. These allow custom transforming both ways between state and URLs, for example converting :year/:month/:day into a Date object and back again
* Fix: Removed usage of Object.values due to no support in older browsers and requirement of a polyfill

### 0.5.1

* Fix: ES5 build was missing a file so imports would fail in some conditions

### 0.5.0

* Major: official support for query strings (adds dependency on `qs` from `hapijs`)
* Support most of path syntax within query strings, e.g. `/foo?q=:searchTime&bar=(:optionalParam)&*=:rest`
* Added property to NavigationProvider: `performInitialNavigation`
* Added property to NavigationProvider: `basePath`
* Breaking: renamed `withState` HOC to `withLocation` to avoid naming conflict with `recompose` (and `state` in general)
* New `withContext` HOC to get access to `stringify` and other functions from the provider
* Additional logic can now be added to route matching use `resolve` property on your routes
* Use empty location `{}` for default Redux state
* NavigationProvider's `routes` property can now accept an array instead of a RouteMapper
* Can now use `resolve` on route objects
* Allow `path` to be empty on routes; these can be used as containers to apply state, resolvers, query fragments in a grouped fashion; see `themes` in the `queryStrings` demo!
* Big sort out of the demos! A lot more use cases are now demonstrated and working properly
* Added tests to many things

### 0.3.2

* Easier integration with and a new demo for Redux
* `<Provider/>` component in `jarl-react-redux` is a standard integration that will (probably) do what you need
* Named matches now automatically run through decodeURIComponent to handle special characters properly
* Correctly reattach to history in CWRP (necessary for React Hot Reload among other things)

### 0.3.1

* Fix withNavigate's default props mapper

### 0.3.0

* Breaking: Rename resolve->stringify. Resolve is already an overloaded term in JS. Stringify is much clearer meaning.
* Breaking: Rename withRouting->withNavigate. This HOC only injects a `navigate` function so the name was confusing
* Breaking: Restructured to monorepo design with `lerna`. Redux extensions are now in separate `jarl-react-redux` package
* Properly sorted out build targets (CJS, UMD, ES) in both packages
* Better errors on stringification failure to debug state problems
* Add a new withState HOC to inject the current route's state
* Added many tests! Including E2E tests with cypress
* Started writing some proper documentation, updated README a bit
* Switched to custom build of `url-pattern` to support named wildcards with syntax: `/*:name`

### 0.2.0

* Added route matching and path resolution for nested routes

### 0.1.2

* Don't completely override Link's own onClick handler

### 0.1.1

* Call onClick handler when Link is clicked (e.g. allowing consumers to call `event.stopPropagation()`)

### 0.1.0

* Routes with dynamic path segments now resolve to URLs correctly

### 0.0.8

* Link now supports string values for `to` prop
* Add enzyme config and a Link test

### 0.0.5

* Initial release

## Copyright

&copy;2017 Downplay Ltd

Distributed under MIT license. See LICENSE for full details.
