import React from "react";
import { Page, Header, Body } from "../../../layout";
import SearchForm from "../components/SearchForm";

interface SearchProps {
    searchTerm?: string;
}

const Search = ({ searchTerm }: SearchProps) => (
    <Page>
        <Header>Search</Header>
        <Body>
            <SearchForm initialValue={searchTerm} />
            {searchTerm && <div data-test="search-results">Results for {searchTerm}</div>}
        </Body>
    </Page>
);

export default Search;
