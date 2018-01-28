import React from "react";

import { Page, Header, Body } from "../layout";

const queryToString = query =>
    query ? Object.entries(query).map(([k, v]) => `${k}=${v}`) : "";

const NotFound = ({ missingPath, query }) => (
    <Page>
        <Header>Not Found</Header>
        <Body>
            The path{" "}
            <code>
                /{missingPath}?{queryToString(query)}
            </code>{" "}
            does not exist
        </Body>
    </Page>
);

export default NotFound;
