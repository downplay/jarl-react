# Server Side Rendering (SSR)

The ability to render HTML on the server or on the client is a powerful feature of React and JARL fully supports this scenario.

To get this working you will just need to do a little extra work _prior_ to rendering your page, to ensure the router is initialized in the correct state (rather than relying on lifecycle methods to perform the initial routing, which is how it normally works in the browser).

Additionally if your routes use any `resolve` methods then any Promises will also need to be resolved before attempting to render the page. React's rendering is synchronous (**currently**...) so any async work must be done up front.

A typical SSR renderer (in express) might look like this (obviously simplified):

```js
express.get("*", (req, res) => {
    const reactHtml = ReactDOMServer.render(<App />);
    res.send(makeHtmlPage(reactHtml));
});
```

To handle routing here we'll need to bring the RoutingProvider outside of App to gain a little more control (and do something slightly different on the client vs the server)
