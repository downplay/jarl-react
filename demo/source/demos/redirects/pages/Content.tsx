import React from "react";
import { Page, Header, Body } from "../../../layout";

interface ContentProps {
    slug: string;
    content: {
        title: string;
        body: string;
    };
}

/* eslint-disable react/no-danger */
const Content = ({ slug, content: { title, body } }: ContentProps) => (
    <Page>
        <Header>{title}</Header>
        <Body>
            <div dangerouslySetInnerHTML={{ __html: body }} />
            <p>This content was loaded asynchronously from the API. Slug for this page: {slug}</p>
        </Body>
    </Page>
);

export default Content;
