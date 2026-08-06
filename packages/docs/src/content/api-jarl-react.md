# jarl-react API reference

Hand-curated reference for the core exports of `jarl-react` (v1). This replaces the
old `react-docgen`-driven pipeline that scraped these tables from JSDoc/propTypes at
build time; the props below are ported from the same source comments in
`packages/jarl-react/source/*.js`, kept up to date by hand.

## `<RoutingProvider>`

Provides routing functionality to the entire app (or a subtree), via React legacy
context. Must wrap the top of the tree that uses `Link`, `Router`, or the `routing` HOC.

| prop | type | required | description |
| --- | --- | --- | --- |
| `routes` | `Array` \| `RouteMap` | yes | The route table, or a pre-built `RouteMap`. |
| `history` | `History` | yes | A `history` package instance (browser, memory, etc). |
| `location` | `Object` | no | The current location state object (controlled). |
| `resolved` | `Object` | no | Resolved data to expose via context. |
| `onChange` | `Function` | no | Called with `{ location, resolved, ... }` on every navigation. |
| `context` | `Function` | no | Returns extra context passed into route `resolve`/`match` callbacks. |
| `performInitialRouting` | `Boolean` | no | Route immediately on mount using the current `history` location (default `true`). |
| `basePath` | `String` | no | Strips/prepends a base path, letting a provider operate inside a subtree. |

## `<Link>`

Renders an anchor linking to a location; clicking triggers a controlled navigation
instead of a full page load.

| prop | type | required | description |
| --- | --- | --- | --- |
| `to` | `String` \| `Object` | no | The path or location object to link to. |
| `activeClassName` | `String` | no | Extra class applied when this link is "active" (current page or an ancestor). |
| `onClick` | `Function` | no | Extra click handler; call `event.preventDefault()` to cancel navigation. |
| `redirect` | `Boolean` | no | If true, replaces history instead of pushing. |
| `element` | `Component` \| `String` | no | Render as something other than `a`. |
| `children` | `Node` \| `Function` | no | Function-as-child receives `{ href, onClick, active }`. |

## `routing()` (higher-order component)

`routing(mapLocationToProps, mapRoutingToProps, mapResolvedToProps)` wraps a
component and injects `location`, `resolved`, `navigate`, `redirect`, `stringify`, and
`isActive` as props, reading them from the `RoutingProvider`'s context. All three
mapping arguments are optional - omit them and the entire location/resolved objects are
spread onto the wrapped component.

## `<Router>`

A function-as-child alternative to the `routing` HOC, for cases where a HOC doesn't
fit (e.g. deep inside JSX without wanting to name a new component):

```jsx
<Router>{(location, resolved) => <p>{location.page}</p>}</Router>
```

## `redirect(to)`

Used inside a route's `resolve` callback (or thrown/returned from it) to short-circuit
navigation to a different location - `RoutingProvider` turns it into a
`history.replace` rather than a `push`, so the browser history doesn't retain the URL
that was redirected away from.

## `RouteMap`

The compiled representation of a routes array: matches a path to a branch of routes
and a location state object, and stringifies a location state object back into a path
(the reverse operation `Link` uses to compute `href`).

---

See the [v1 History](/history) page for how these pieces fit together, and why v2
replaces this API with jotai atoms.
