import { combineReducers, createStore } from "redux";
import { reducer as navigation } from "jarl-react-redux";

/**
 * JARL looks on "navigation" key by default, but this can be
 * configured in the Provider
 */
export default createStore(
    combineReducers({
        navigation
    })
);
