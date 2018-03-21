## Redux Integration

JARl used to live alongside a small Redux integration library (it's still there but is being officially deprecated). As JARL has grown we have found its design allows it to be tightly integrated with Redux without needing an additional library to do this.

Redux integration can mean different things depending on your point of view, therefore we don't want to proscribe any one particular setup, but the simplest case would look like this. Since JARL is a controlled router, it can be driven from global state like any other Redux-connected component. You've written a hundred reducers like this so I don't need to tell you what conventions to use, but here's how I would writing a routingReducer:

`actionTypes.js`:

```js
export const ROUTE_CHANGE = "ROUTE_CHANGE";
```

`actions.js`:

```js
export const routeChange = ({ location, }) => (

)
```
