import React from "react";

import { Page, Header, Body } from "../layout";

const Error = ({ error, info }) => (
    <Page>
        <Header>Error</Header>
        <Body>
            <p>Error:</p>
            <pre>{error.toString()}</pre>
            <p>Info:</p>
            <pre>
                {JSON.stringify(info)
                    .split("\\n")
                    .map((line, i) => <pre key={i}>{line}</pre>)}
            </pre>
        </Body>
    </Page>
);

export default Error;
