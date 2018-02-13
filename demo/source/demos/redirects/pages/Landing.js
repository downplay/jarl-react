import React from "react";
import { Page, Header, Body } from "../../../layout";

const Landing = ({ reason, authenticated, onToggleLogin }) => (
    <Page>
        <Header>Landing</Header>
        <Body>
            <p>
                Demonstrating redirect behaviour. The various menu links will
                redirect back here under different conditions, and when this
                happens the reason will be displayed below.
            </p>
            <p data-test="redirect-reason">
                {reason
                    ? `Reason for redirect: ${reason}`
                    : "Right now no redirect has occurred!"}
            </p>
            <p>
                To control the admin redirect, use this button to log in or out:
            </p>
            <p>
                <button type="button" onClick={onToggleLogin}>
                    {authenticated ? "Logout" : "Login"}
                </button>
            </p>
        </Body>
    </Page>
);

export default Landing;
