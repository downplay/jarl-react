import React from "react";

import { Page, Header, Body } from "../layout";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryToString = (query: Record<string, any> | undefined) =>
    query ? Object.entries(query).map(([k, v]) => `${k}=${v}`) : "";

interface NotFoundProps {
    missingPath?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: Record<string, any>;
}

const NotFound = ({ missingPath, query }: NotFoundProps) => (
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
