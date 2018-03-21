import React from "react";
import { render } from "react-dom";
import { Provider } from "rebass-emotion";
import Root from "./Root";

// eslint-disable-next-line
__webpack_public_path__ = "/";

const container = document.getElementById("root");
render(
    <Provider>
        <Root />
    </Provider>,
    container
);
