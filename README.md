# downtools

Miscellaneous helpers for React.

## Install

```
yarn add downtools
```

## withViewport

HOC to inject `viewportWidth` and `viewportHeight` properties into your views, for responsive rendering, and update them when the window resizes.

### Usage

This example hides the menu inside a button on small screens:

```jsx
import { withViewport } from "downtools";

const MyComponent = ({viewportWidth, viewportHeight}) => (
    viewportWidth < 800 ? <HamburgerMenu /> : <SideMenu />
)

export default withViewport()(MyComponent);
```

The properties will be updated whenever the window resizes, for fully responsive updates.

### Configuration

The HOC accepts a configuration object when executed, the options are as follows:

```js
export default withViewport({
    browserlessWidth: 1024,
    browserlessHeight: 768,
    handleRehydration: true
})(MyComponent);
```

### With server-side rendering

When rendering on the server, there is no window available, and we cannot yet know how big the viewport is going to be. `withViewport` will inject defaults in this case, these are set to 1920x1080, but can be overriden with the `browserlessWidth` and `browserlessHeight` configuration parameters. A third property `isBrowserless` will also be injected with value `true`.

This allows you to detect whether server-side rendering is in progress, and if so possibly render things a little differently. You might want to avoid rendering the viewport-aware parts of your app, and then render them once you know what space they have, rather than first rendering a wrongly-sized version and then updating it after the page loads.

### Client rehydration

When first rendering on the client ("rehydration") we have to do a little more work. Now the window is available your component might render differently -- but that's not what we actually want! In rehyrdation you want the page to render exactly as it was on the server, otherwise React gives errors.

So to circumvent this the HOC takes a third configuration parameter, `handleRehydration`. If this set to `true` then the HOC will perform a special first-pass render where it *ignores* the window and provides the same default/browserless dimensions (and also `isBrowserless` true). The idea is you can perform a rehydration render with exactly the same state as you did on the server.

The component will then immediately update its own state after mounting (state is updated a `setImmediate` call). This will cause an additional render where you have the real width and height.

### TODO: Handling user session

## Tests

```
git clone https://github.com/downplay/downtools
cd downtools
yarn
yarn test
```

## Version History

### 0.1.0

* Initial release, includes only `withViewport`

## Copyright

&copy;2017 Downplay Ltd

Distributed under MIT license. See LICENSE for full details.
