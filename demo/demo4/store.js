import { combineReducers, createStore } from "redux";
import { reducer as navigation } from "jarl-react-redux";

/**
 * JARL looks on "navigation" key by default, but this can be
 * configured in the Provider
 */
export default createStore(
    combineReducers({
        navigation
    }),
    /* eslint-disable no-underscore-dangle */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    /* eslint-enable no-underscore-dangle */
);
