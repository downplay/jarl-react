import React from "react";
import { Provider as ReduxProvider } from "react-redux";

import { Provider } from "jarl-react-redux";

import Pages from "./Pages";

import store from "./store";

const Root = ({ history, routes }) => (
    <ReduxProvider store={store}>
        <Provider store={store} history={history} routes={routes}>
            <Pages />
        </Provider>
    </ReduxProvider>
);

export default Root;
