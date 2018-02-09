import React from "react";
import { Page, Header, Body } from "../../../layout";

/* eslint-disable react/no-danger */
const Content = ({ slug, content: { title, body } }) => (
    <Page>
        <Header>{title}</Header>
        <Body>
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <p>
                This content was loaded asynchronously from the API. Slug for
                this page: {slug}
            </p>
        </Body>
    </Page>
);

export default Content;
