import React from "react";

import { Page, Header, Body } from "../layout";

const NotFound = ({ missingPath }) => (
    <Page>
        <Header>Not Found</Header>
        <Body>
            The path <code>/{missingPath}</code> does not exist
        </Body>
    </Page>
);

export default NotFound;
