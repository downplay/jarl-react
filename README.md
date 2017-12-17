# jarl-react

Just Another Router Library for React.

## Philosophy

* URLs are a public API into your appplication
* Routes define a mapping between URL and state
* Routing is a core part of your application logic
* A router should not dictate state mechanism nor navigation lifecycle
* Data dependencies are closely bound to routes

Putting all of this together, I wanted a router

## Documentation

See docs here:
https://github.com/downplay/jarl-react/tree/master/docs

## Install

```
yarn add jarl-react
```

## Tests

```
git clone https://github.com/downplay/jarl-react
cd jarl-react
yarn
yarn test
```

## Version History

### Next release

* Added route matching and path resolution for nested routes

### 0.1.2

* Don't completely override Link's own onClick handler

### 0.1.1

* Call onClick handler when Link is clicked (e.g. allowing consumers to call `event.stopPropagation()`)

### 0.1.0

* Routes with dynamic path segments now resolve to URLs correctly

### 0.0.8

* Link now supports string values for `to` prop
* Add enzyme config and a Link test

### 0.0.5

* Initial release

## Copyright

&copy;2017 Downplay Ltd

Distributed under MIT license. See LICENSE for full details.
