# jarl-react-native API reference

`jarl-react-native` adapts the same controlled-component router to React Native: the
core `RoutingProvider`/`routing`/`Link` API from `jarl-react` is unchanged, but this
package adds:

* A `memoryHistory`-friendly setup (no browser URL bar), wired to the hardware back
  button on Android.
* Deep link handling, converting an incoming URL into a `history.push`/`replace` so the
  same route table drives both in-app navigation and deep links.
* A native-friendly `Link` that renders a `TouchableOpacity`/`Text` pair (or whatever
  `element` is supplied) instead of an `<a>`, since the "URL" is purely conceptual on
  native - it never appears in a real address bar.

Because JARL v1 models locations as plain serializable state objects rather than
coupling directly to URLs, the same route table and page components can be shared
between the web and native apps almost unchanged - only the `history` implementation
and the rendered `Link` differ.

See the [Getting Started](/docs/getting-started) guide, and the
[React Native](/docs/react-native) guide for setup specifics.
