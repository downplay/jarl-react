import React from "react";
import { Page, Header, Body } from "../../../layout";

const NotFound = ({ missingPath }) => (
    <Page>
        <Header>404 Not Found</Header>
        <Body>
            <p data-test="mordor">
                One does not simply navigate to {missingPath}
            </p>
        </Body>
    </Page>
);

export default NotFound;
