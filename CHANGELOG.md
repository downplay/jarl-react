# JARL: Version History

## 1.0.0-alpha.4

*   Fixed error due to missing actionTypes.js in `jarl-react-redux`

## 1.0.0-alpha.3

*   Slightly relaxed error throwing in the case of an invalid Link. Don't really want to stop the whole app rendering (or even really throw at all) just because a Link was null, but we do want pretty obvious console errors if a location is unresolvable as that definitely indicates a bug.

## 1.0.0-alpha.2

*   React Native support! A new package `jarl-react-native` brings a reasonably comprehensive RN compatible integration including:
    *   A router wrapper, `NativeProvider`, using createMemoryHistory
    *   A variant of the Link component using TouchableHighlight
    *   Back Button (Android) and Deep Linking support. Both optional via props on the NativeProvider.

## 1.0.0-alpha

### Breaking

*   The big rename landed! Massively simplified the API while providing more flexibility. (I hope!)

    *   `NavigationProvider` is now `RoutingProvider`
    *   `performInitialNavigation` -> `performInitialRouting`
    *   `onNavigateStart` and `onNavigateEnd` are collapsed into a single `onChange`. The router is fully controlled: any additional transitions or preloading can be executed before you update location so advanced possibilities are still accounted for. Redux integration's API is unchanged but the whole package might be heading for deprecation.
    *   `SimpleProvider` is now `StateProvider`
    *   `withContext`, `withLocation`, `withNavigate` all disappeared and are replaced by `routing`
    *   `RouteMapper` is now `RouteMap`
    *   `state` has been renamed to `location` _in some places_:
        *   `RoutingProvider` and `StateProvider`'s state prop
        *   Signature of `onChange` callback
        *   Return of `match` function on `RouteMap`
        *   It has _not_ changed on `Route` as this is clearly distinct and is generally just part of the whole location.

*   Other breaking:
    *   `resolve` functions now execute in series; results aren't stored in state anymore but they are made available thru `resolved` on the onChange handler

### New features

*   Brand new `routing` HOC which provides all the functionality of the old HOCs (but with default parameters acts just like `withLocation` used to)
*   `Router` component is a new function-as-child version of `withLocation`
*   Recent changes to `Link` support all the functionality of `withContext` and `withNavigate` (i.e. URL serialization, and navigate/redirect) with a function-as-child API.

## 0.8.0

*   Breaking: renamed `component` prop on `Link` to `element` to be more consistent with PropTypes
*   Breaking: changed the method signature of onNavigateStart and onNavigateEnd callbacks. They now emit an event object in the form `{ state, path, branch, action }` and are now consistent with onNavigateError.
*   Added `action` to the callback emitted from onNavigateStart/onNavigateEnd/onNavigateError. This will be the action received from the `history` listener and be one of: PUSH, REPLACE, or POP for actions triggered by `history`, or INITIAL or RELOAD for initial navigation or reloaded routes triggered by JARL.
*   Fixed nested stringifiers
*   Proper implementation of isActive. Now considers the route hierarchy rather than looking purely at the URL -- meaning it will work with partial paths and query strings
*   Added a function-as-child API to `<Link>`; provides `href`, `active` and `onClick` props so you can render anything that links to a route
*   Redirect now causes a history.replace() instead of history.push()
*   Another big push on documentation
*   Upgraded demos site to Webpack 4 / React Hot Loader 4
*   Added `sideEffects: false` to package.json, for Webpack 4's "pure module" support
*   Bug fixes and other minor improvements

## 0.7.2

*   Fixed nested match
*   Add a `component` prop to Link to override default anchor rendering

## 0.7.1

*   Fixed the build process for IE11 and other older browsers

## 0.7.0

*   New feature: redirects. Can be triggered from `state`, `match`, or `resolve` by returning a `redirect` object. See examples in demos.
*   Added a half-decent example to the README

## 0.6.0

*   Now supports `match` and `stringify` functions on routes. These allow custom transforming both ways between state and URLs, for example converting :year/:month/:day into a Date object and back again
*   Fix: Removed usage of Object.values due to no support in older browsers and requirement of a polyfill

## 0.5.1

*   Fix: ES5 build was missing a file so imports would fail in some conditions

## 0.5.0

*   Major: official support for query strings (adds dependency on `qs` from `hapijs`)
*   Support most of path syntax within query strings, e.g. `/foo?q=:searchTime&bar=(:optionalParam)&*=:rest`
*   Added property to NavigationProvider: `performInitialNavigation`
*   Added property to NavigationProvider: `basePath`
*   Breaking: renamed `withState` HOC to `withLocation` to avoid naming conflict with `recompose` (and `state` in general)
*   New `withContext` HOC to get access to `stringify` and other functions from the provider
*   Additional logic can now be added to route matching use `resolve` property on your routes
*   Use empty location `{}` for default Redux state
*   NavigationProvider's `routes` property can now accept an array instead of a RouteMapper
*   Can now use `resolve` on route objects
*   Allow `path` to be empty on routes; these can be used as containers to apply state, resolvers, query fragments in a grouped fashion; see `themes` in the `queryStrings` demo!
*   Big sort out of the demos! A lot more use cases are now demonstrated and working properly
*   Added tests to many things

## 0.3.2

*   Easier integration with and a new demo for Redux
*   `<Provider/>` component in `jarl-react-redux` is a standard integration that will (probably) do what you need
*   Named matches now automatically run through decodeURIComponent to handle special characters properly
*   Correctly reattach to history in CWRP (necessary for React Hot Reload among other things)

## 0.3.1

*   Fix withNavigate's default props mapper

## 0.3.0

*   Breaking: Rename resolve->stringify. Resolve is already an overloaded term in JS. Stringify is much clearer meaning.
*   Breaking: Rename withRouting->withNavigate. This HOC only injects a `navigate` function so the name was confusing
*   Breaking: Restructured to monorepo design with `lerna`. Redux extensions are now in separate `jarl-react-redux` package
*   Properly sorted out build targets (CJS, UMD, ES) in both packages
*   Better errors on stringification failure to debug state problems
*   Add a new withState HOC to inject the current route's state
*   Added many tests! Including E2E tests with cypress
*   Started writing some proper documentation, updated README a bit
*   Switched to custom build of `url-pattern` to support named wildcards with syntax: `/*:name`

## 0.2.0

*   Added route matching and path resolution for nested routes

## 0.1.2

*   Don't completely override Link's own onClick handler

## 0.1.1

*   Call onClick handler when Link is clicked (e.g. allowing consumers to call `event.stopPropagation()`)

## 0.1.0

*   Routes with dynamic path segments now resolve to URLs correctly

## 0.0.8

*   Link now supports string values for `to` prop
*   Add enzyme config and a Link test

## 0.0.5

*   Initial release
