import React, { Fragment } from "react";

const NotFound = ({ missingPath }) => (
    <Fragment>
        <header>
            <h1>404 Not Found</h1>
            <p>One does not simply navigate to {missingPath}</p>
        </header>
    </Fragment>
);

export default NotFound;
