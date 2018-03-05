# Status and roadmap

JARL is a fully working and powerful routing library that already supports pretty much every use case enabled by other major routers (`react-router` being the de facto benchmark) and many scenarios besides. But, there is still work I feel I need to do before I can confidently say this is my recommended routing solution for React!

So here is what I would like to achieve before I'm ready to call this version 1.0.0-alpha...

## Documentation and demos

The current set of demos (and E2E tests) show off many features and scenarios but there is plenty missing, and documentation is drastically incomplete.

Demos also need some styling love, and actually publishing somewhere. Cypress test run videos to be uploaded somewhere too.

## Massive breaking changes to nomenclature

This is unfortunately coming - as the router has evolved, and as I've applied it in real world cases, I've started to realise that a number of API methods are badly named, using many overloaded and/or unneccessary terms. This will follow semver and land fully in v1, but may be introduced earlier in a non-breaking fashion with dev-only warnings. The bikeshedding continues, but right now I plan the following name changes:

`state` and `context` -> `location` and `externals`(?)

The most overloaded terms, especially in React world, and they mean different things in several places within JARL. `location` better describes a serializable location descriptor. But I am struggling to think of the best word for `context`, and this is the major blocker to this entire rename ;)

`match` and `stringify` -> `transform` and `serialize`

This change mainly makes sense on the route properties. Match is kind of vague, overloaded, and doesn't accurately convey what this callback does. Stringify is a silly word, which obviously was in parity both with `JSON.stringify` and the `stringify` API of `url-pattern`, but `serialize` is the proper term and is actually a real word.

`withNavigate`, `withContext`, `withActive` -> `routing`

Currently `withNavigate` just provides a `navigate` function so the name made sense, but `withFoo` is vastly overused in the world of HOCs and the `with` is just unneccesary. Additional functions will be provided (inc. `replace` and `serialize`, see above) so `routing` better describes this general navigation functionality. Combining all three HOCs seems like a good API simplification.

## Integrations

*   React Native (largely just needs a replacement for the Link component, maybe a Provider which uses memoryHistory?)

## Misc task

*   Really hard to debug errors caused by badly constructed routes. e.g.

```js
             {
                path: "/product/:id",
                state: {
                    page: "product"
                },
                routes: [
                    {
                        path: "/product/:id/details",
                        state: {
                            page: "details"
                        }
                    }
                ]
            }
```

This causes an error due to needing two ids in an array.
Need to either detect this when we check if the keys are there, or throw a warning/error on the route table that it looks like the user did something invalid. Either way need better sanitisation of the routes, and perhaps some more detailed debug output (maybe a debug mode in dev to see what did/didn't match and why)

# Future plans

Some additional plans that are more "nice-to-have" and might wait until after 1.0.0 and possibly provided in separate packages:

*   Look at a whole new story for Redux, sync URL to Redux state automatically rather than other way around.
*   Considering `redux-saga` support ... and maybe integrations with other popular state libraries
*   Big refactor: some of the main classes have grown bloated and overly complex as functionality has been added in, making things hard to test and debug
*   Component API: function-as-child version of Route (/Router?)
*   Figure out the best way to support animated transitions, and make some cool demos for this
*   Optional path segments. The `url-pattern` syntax supports this but JARL doesn't
*   Query strings: support nesting and arrays. I use `qs` to parse query strings, it supports an advanced syntax for nesting and arrays, but this is not understood by matching or stringification.
*   Query strings: support compound interpolations for optional query keys. This means multiple interpolations on a single token, a good example might be: `/range?start=(:startYear-:startMonth-:startDay)&end=(:endYear-:endMonth-:endDay)`. This will not work and is pretty hard to support right now.
*   Alternatively: replace `qs` with a completely custom parser, possibly extending `url-pattern` to achieve this. This would make it easier to add some new sugar to the syntax:
    *   Query shorthand for a frequent usage pattern: `?:first&(:second)` would expand to `?first=:first&second=(:second)`
    *   Arrays: `qs`'s array syntax is pretty ugly and it's hard to see how I would combine it with the variable syntax. A neater syntax to consider is: `?foo=:values[,]` where ',' is a separator. An advantage of this is that it could work in path segments too.
*   At some point, move to new context API. Preferably support both old and new versions.
*   Consider new async APIs and what they can provide
