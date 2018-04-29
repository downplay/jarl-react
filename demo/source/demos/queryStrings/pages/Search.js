import React from "react";
import { Segment } from "semantic-ui-react";

import { Page, Header, Body } from "../../../layout";

const Search = ({ searchTerm }) => (
    <Page>
        <Header>Search</Header>
        <Body>
            {searchTerm && (
                <Segment data-test="search-results">
                    <p>Results for {searchTerm}:</p>
                    <script
                        dangerouslySetInnerHtml={{
                            __html: `
                                <script>
                                (function() {
                                    var cx = '011305364395630331670:tionb9mfxlq';
                                    var gcse = document.createElement('script');
                                    gcse.type = 'text/javascript';
                                    gcse.async = true;
                                    gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
                                    var s = document.getElementsByTagName('script')[0];
                                    s.parentNode.insertBefore(gcse, s);
                                })();
                                </script>
                                <gcse:searchresults-only></gcse:searchresults-only>`
                        }}
                    />
                </Segment>
            )}
        </Body>
    </Page>
);

export default Search;
