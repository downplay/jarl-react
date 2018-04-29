import React from "react";

import md from "./Home.md";

import { Page, Header, Body, MarkdownJsx } from "../../../layout";

const Home = () => (
    <Page>
        <Header>Home</Header>
        <Body>
            <MarkdownJsx source={md} />
        </Body>
    </Page>
);

export default Home;
