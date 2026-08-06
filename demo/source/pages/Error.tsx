import React from "react";

import { Page, Header, Body } from "../layout";

interface ErrorPageProps {
    error: Error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any;
}

const Error = ({ error, info }: ErrorPageProps) => (
    <Page>
        <Header>Error</Header>
        <Body>
            <p>Error:</p>
            <pre>{error.toString()}</pre>
            <p>Info:</p>
            <pre>
                {JSON.stringify(info)
                    .split("\\n")
                    // eslint-disable-next-line react/no-array-index-key
                    .map((line, i) => (
                        <pre key={i}>{line}</pre>
                    ))}
            </pre>
        </Body>
    </Page>
);

export default Error;
