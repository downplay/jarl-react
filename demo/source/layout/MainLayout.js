import React from "react";
import styled from "react-emotion";
import { Heading, Subhead, Lead, Container } from "rebass-emotion";

const Grid = styled.div`
    display: grid;
    grid-template-columns: 10rem 50% 50%;
    grid-template-rows: 10rem auto;
`;

const HeaderRow = styled.div`
    grid-column-start: 1;
    grid-column-end: 4;
`;

const MenuSidebar = styled.div``;
const ContentPanel = styled.div``;
const CodePanel = styled.div``;

const MainLayout = ({ children, code, menu }) => (
    <Grid>
        <HeaderRow>
            <Heading>JARL</Heading>
            <Subhead>Just Another Routing Library (for React)</Subhead>
            <Lead>Demos and documentation</Lead>
        </HeaderRow>
        <MenuSidebar>
            <Subhead>Menu</Subhead>
            {menu}
        </MenuSidebar>
        <ContentPanel>{children}</ContentPanel>
        <CodePanel>{code}</CodePanel>
    </Grid>
);

export default MainLayout;
