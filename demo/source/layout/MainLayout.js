import React, { Fragment } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { coy as style } from "react-syntax-highlighter/styles/prism";
import styled from "react-emotion";
import { Heading, Subhead, Lead, Small } from "rebass-emotion";

const Grid = styled.div`
    display: grid;
    grid-template-columns: 15rem 1fr 40rem;
    grid-template-rows: 10rem auto;
    padding: 3rem;
`;

const HeaderRow = styled.div`
    grid-column-start: 1;
    grid-column-end: 4;
`;

const MenuSidebar = styled.div`
    padding-right: 2rem;
`;
const ContentPanel = styled.div``;
const CodePanel = styled.div`
    font-size: 80%;
`;

const MainLayout = ({ children, code, menu }) => (
    <Grid>
        <HeaderRow>
            <Heading>
                JARL <Small>v{process.env.JARL_VERSION}</Small>
            </Heading>
            <Subhead>Just Another Routing Library (for React)</Subhead>
            <Lead>Demos and documentation</Lead>
        </HeaderRow>
        <MenuSidebar>
            <Subhead>Menu</Subhead>
            {menu}
        </MenuSidebar>
        <ContentPanel>{children}</ContentPanel>
        <CodePanel>
            {code &&
                code.map(({ name, code: source }) => (
                    <Fragment key={name}>
                        <Lead>{name}:</Lead>
                        <SyntaxHighlighter language="jsx" style={style}>
                            {source}
                        </SyntaxHighlighter>
                    </Fragment>
                ))}
        </CodePanel>
    </Grid>
);

export default MainLayout;
