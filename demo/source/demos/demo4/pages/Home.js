import React from "react";
import { connect } from "react-redux";

import { Page, Header, Body } from "../../../layout";

const Home = ({ state }) => (
    <Page>
        <Header>Home</Header>
        <Body>
            <p>
                This demo shows using the Provider from jarl-react-redux to
                manager router state inside your Redux store instead of local
                component state. The entire Redux state is serialized here:
            </p>
            <pre>{state}</pre>
        </Body>
    </Page>
);

export default connect(state => ({ state: JSON.stringify(state, null, "  ") }))(
    Home
);
