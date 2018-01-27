import React from "react";
import { Link } from "jarl-react";

import { Page, Header, Body } from "../layout";

const demos = [];

const Index = () => (
    <Page>
        <Header>JARL Demos Index</Header>
        <Body>{demos.map(demo => <Link to={demo.path} />)}</Body>
    </Page>
);

export default Index;
