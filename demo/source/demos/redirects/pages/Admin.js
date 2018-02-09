import React from "react";
import { Page, Header, Body } from "../../../layout";

const Admin = ({ authenticated }) => (
    <Page>
        <Header>Search</Header>
        <Body>
            <p>This is the super secret admin page!</p>
            <p>
                If this value is false then you really shouldn&squot;t be here:
                {authenticated}
            </p>
        </Body>
    </Page>
);

export default Admin;
