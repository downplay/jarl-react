import React, { Fragment } from "react";
import styled from "react-emotion";
import { Header, Label } from "semantic-ui-react";
import { Highlight } from "./MarkdownJsx";

const Grid = styled.div`
    display: grid;
    grid-template-columns: 15rem 1.2fr 1fr;
    grid-template-rows: 8rem auto;
    padding: 3rem;
`;

const HeaderRow = styled.div`
    grid-column-start: 1;
    grid-column-end: 4;
`;

const MenuSidebar = styled.div`
    padding-right: 2rem;
`;

const ContentPanel = styled.div`
    padding: 0 2rem;
`;

const FullContentPanel = styled(ContentPanel)`
    grid-column-start: 2;
    grid-column-end: 4;
`;

const CodePanel = styled.div`
    font-size: 80%;
`;

const MainLayout = ({ children, code, menu }) => (
    <Grid>
        <HeaderRow>
            <Header as="h1">
                JARL Demos{" "}
                <small data-test="version">{process.env.JARL_VERSION}</small>
            </Header>
            <Header sub>Just Another Routing Library (for React)</Header>
        </HeaderRow>
        <MenuSidebar>{menu}</MenuSidebar>
        {code ? (
            <ContentPanel data-test="content">{children}</ContentPanel>
        ) : (
            <FullContentPanel data-test="content">{children}</FullContentPanel>
        )}
        {code &&
            code.map(({ name, code: source }) => (
                <CodePanel data-test="code">
                    <Fragment key={name}>
                        <Label>{name}:</Label>
                        <Highlight language="jsx" source={source} />
                    </Fragment>
                </CodePanel>
            ))}
    </Grid>
);

export default MainLayout;
