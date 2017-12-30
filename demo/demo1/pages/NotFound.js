import React, { Fragment } from "react";

const NotFound = ({ missingPath }) => (
    <Fragment>
        <header>
            <h1 data-test="header">404 Not Found</h1>
        </header>
        <p data-test="mordor">One does not simply navigate to {missingPath}</p>
    </Fragment>
);

export default NotFound;
