# JARL: Version History

## 0.7.3

* Fixed nested stringify

## 0.7.2

* Fixed nested match
* Add a `component` prop to Link to override default anchor rendering

## 0.7.1

* Fixed the build process for IE11 and other older browsers

## 0.7.0

* New feature: redirects. Can be triggered from `state`, `match`, or `resolve` by returning a `redirect` object. See examples in demos.
* Added a half-decent example to the README

## 0.6.0

* Now supports `match` and `stringify` functions on routes. These allow custom transforming both ways between state and URLs, for example converting :year/:month/:day into a Date object and back again
* Fix: Removed usage of Object.values due to no support in older browsers and requirement of a polyfill

## 0.5.1

* Fix: ES5 build was missing a file so imports would fail in some conditions

## 0.5.0

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

## 0.3.2

* Easier integration with and a new demo for Redux
* `<Provider/>` component in `jarl-react-redux` is a standard integration that will (probably) do what you need
* Named matches now automatically run through decodeURIComponent to handle special characters properly
* Correctly reattach to history in CWRP (necessary for React Hot Reload among other things)

## 0.3.1

* Fix withNavigate's default props mapper

## 0.3.0

* Breaking: Rename resolve->stringify. Resolve is already an overloaded term in JS. Stringify is much clearer meaning.
* Breaking: Rename withRouting->withNavigate. This HOC only injects a `navigate` function so the name was confusing
* Breaking: Restructured to monorepo design with `lerna`. Redux extensions are now in separate `jarl-react-redux` package
* Properly sorted out build targets (CJS, UMD, ES) in both packages
* Better errors on stringification failure to debug state problems
* Add a new withState HOC to inject the current route's state
* Added many tests! Including E2E tests with cypress
* Started writing some proper documentation, updated README a bit
* Switched to custom build of `url-pattern` to support named wildcards with syntax: `/*:name`

## 0.2.0

* Added route matching and path resolution for nested routes

## 0.1.2

* Don't completely override Link's own onClick handler

## 0.1.1

* Call onClick handler when Link is clicked (e.g. allowing consumers to call `event.stopPropagation()`)

## 0.1.0

* Routes with dynamic path segments now resolve to URLs correctly

## 0.0.8

* Link now supports string values for `to` prop
* Add enzyme config and a Link test

## 0.0.5

* Initial release
