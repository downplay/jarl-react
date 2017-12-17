# jarl-react

Just Another Router Library for React.

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

### Next version

* Breaking: Rename resolve->stringify. Resolve is already an overloaded term in JS. Stringify is much clearer meaning.
* Better errors on stringification failure to debug state problems

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
