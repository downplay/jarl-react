import React, { Fragment } from "react";
import Markdown from "react-remarkable";
import Helmet from "react-helmet";

import readme from "../../../README.md";

const About = () => (
    <Fragment>
        <Helmet>
            <title>About</title>
        </Helmet>
        <Markdown source={readme} />
    </Fragment>
);

export default About;
