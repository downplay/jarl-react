# jarl-react 0.3.0

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
basic conditional rendering tasks. For instance, JARL does not have a `Route`
component: a vanilla JavaScript `switch` statement is perfectly adequate!

Cautionary note: I am still evolving the API based on my own real use-cases. Expect
more things to change, but also many new features.

## Documentation

See docs here:
https://github.com/downplay/jarl-react/tree/master/docs

## Install

```
yarn add jarl-react
```

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

Some ideas and inspiration from `redux-first-router`: https://github.com/faceyspacey/redux-first-router

## Version History

### Next version

* Use empty location `{}` for default Redux state
* NavigationProvider's `routes` property can now accept an array instead of a RouteMapper
* Big sort out of the demos
* Added property to NavigationProvider: `performInitialNavigation`
* Added property to NavigationProvider: `basePath`

### 0.3.2

* Easier integration with and a new demo for Redux
* `<Provider/>` component in `jarl-react-redux` is a standard integration that will (probably) do what you need
* Named matches now automatically run through decodeURIComponent to handle non-ASCII characters properly
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
