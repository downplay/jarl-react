import React, { Fragment } from "react";
import { Page, Header, Body } from "../../../layout";
import SearchForm from "../components/SearchForm";

const Search = ({ searchTerm }) => (
    <Page>
        <Header>Search</Header>
        <Body>
            {searchTerm ? (
                <Fragment>Results for {searchTerm}</Fragment>
            ) : (
                <SearchForm />
            )}
        </Body>
    </Page>
);

export default Search;
