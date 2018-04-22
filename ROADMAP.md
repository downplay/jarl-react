# Status and roadmap

JARL is a fully working and powerful routing library that already supports pretty much every use case enabled by other major routers (`react-router` being the de facto benchmark) and many scenarios besides. But, there is still work I feel I need to do before I can confidently say this is my recommended routing solution for React!

So here is what I would like to achieve before I'm ready to call this version 1.0.0-beta...

## Documentation and demos

The current set of demos (and E2E tests) show off many features and scenarios but there is plenty missing, and documentation is drastically incomplete.

Demos also need some styling love, and actually publishing somewhere. Cypress test run videos to be uploaded somewhere too.

## Integrations

*   Server-side rendering. Improve story, create a written guide and a working example.
*   _Deprecate_ Redux integration but write docs

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
*   Finish the WIP transitions components and make some cool demos
*   Default values for path vars: /:fooName=bar/ ... how does that work with qs?
*   Optional path segments. The `url-pattern` syntax supports this but JARL doesn't
*   Query strings: support nesting and arrays. I use `qs` to parse query strings, it supports an advanced syntax for nesting and arrays, but this is not understood by matching or stringification.
*   Query strings: support compound interpolations for optional query keys. This means multiple interpolations on a single token, a good example might be: `/range?start=(:startYear-:startMonth-:startDay)&end=(:endYear-:endMonth-:endDay)`. This will not work and is pretty hard to support right now.
*   Alternatively: replace `qs` with a completely custom parser, possibly extending `url-pattern` to achieve this. This would make it easier to add some new sugar to the syntax:
    *   Query shorthand for a frequent usage pattern: `?:first&(:second)` would expand to `?first=:first&second=(:second)`
    *   Arrays: `qs`'s array syntax is pretty ugly and it's hard to see how I would combine it with the variable syntax. A neater syntax to consider is: `?foo=:values[,]` where ',' is a separator. An advantage of this is that it could work in path segments too.
*   At some point, move to new context API. Preferably support both old and new versions.
*   Consider new async APIs and what they can provide
