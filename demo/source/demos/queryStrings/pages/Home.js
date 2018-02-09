import React from "react";
import { Page, Header, Body } from "../../../layout";
import SearchForm from "../components/SearchForm";

const Home = () => (
    <Page>
        <Header>Home</Header>
        <Body>
            <p>Enter text to search</p>
            <SearchForm />
        </Body>
    </Page>
);

export default Home;
