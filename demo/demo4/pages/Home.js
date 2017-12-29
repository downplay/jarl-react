import React, { Fragment } from "react";
import { connect } from "react-redux";

const Home = ({ state }) => (
    <Fragment>
        <header>
            <h1>JARL Demo 4: Redux Integration</h1>
        </header>
        <p>
            This demo shows using the Provider from jarl-react-redux to manager
            router state inside your Redux store instead of local component
            state. The entire Redux state is serialized here:
        </p>
        <pre>{state}</pre>
    </Fragment>
);

export default connect(state => ({ state: JSON.stringify(state, null, "  ") }))(
    Home
);
