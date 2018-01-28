import React from "react";
import { Page, Header, Body } from "../../../layout";
import SearchForm from "../components/SearchForm";

const Search = ({ searchTerm }) => (
    <Page>
        <Header>Search</Header>
        <Body>
            <SearchForm />
            {searchTerm && (
                <div data-test="search-results">Results for {searchTerm}</div>
            )}
        </Body>
    </Page>
);

export default Search;
