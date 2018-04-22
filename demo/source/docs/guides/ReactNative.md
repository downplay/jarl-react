# React Native

JARL provides an official React Native integration in the form of the additional `jarl-react-native` package. It provides a new router with some Native-specific features (back button and deep linking) and a new Link component using TouchableHighlight.

Complete example:

```jsx
import React from "react";
import { NativeProvider, Link } from "jarl-react-native";
import { withState } from "recompose";

// Paths are still used internally, although you don't need to touch them
// anywhere else in your app, but they are still required for deep linking.
// A future release may entirely remove the need for paths in a RN app,
// allowing dealing purely with location objects.
const routes = [{ path: "/", state: { page: "home" } }];

const App = ({ location, setLocation }) => (
    <NativeProvider
        routes={routes}
        location={location}
        onChange={({ location }) => setLocation(location)}
    >
        <Link to={{ page: "home" }}>Home</Link>
    </NativeProvider>
);

// Using `withState` from recompose to provide easy state handling
export default withState("location", "setLocation")(App);
```
