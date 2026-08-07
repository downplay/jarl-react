import { useEffect } from "react";

const useTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};

// Mirrors demo/cypress/integration/03QueryStrings.js. The v2 route atoms
// don't read/write query (search) params yet (ticket 56 - "atom feature
// gaps"), so this fixture only renders the static shell needed by the
// "loads home page" and default "light theme" scenarios; the search /
// ?theme=dark / theme-toggle scenarios are test.fixme()'d in the spec.
const QueryStrings = () => {
    useTitle("Query Strings - Home - JARL");
    return (
        <div
            data-test="page"
            style={{ backgroundColor: "rgb(255, 255, 255)" }}
        >
            <div data-test="header" style={{ color: "rgb(0, 0, 0)" }}>
                Home
            </div>
            <form onSubmit={(event) => event.preventDefault()}>
                <input data-test="search-text" type="text" />
                <button data-test="search-button" type="submit">
                    Search
                </button>
            </form>
            <p>
                Query-string aware routing (search, ?theme=) is not yet
                implemented in the v2 route atoms - see ticket 56.
            </p>
        </div>
    );
};

export default QueryStrings;
