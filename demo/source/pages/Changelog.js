import React, { Fragment } from "react";
import Markdown from "react-remarkable";
import Helmet from "react-helmet";

import changelog from "../../../CHANGELOG.md";

const Changelog = () => (
    <Fragment>
        <Helmet>
            <title>Changelog</title>
        </Helmet>
        <Markdown source={changelog} />
    </Fragment>
);

export default Changelog;
