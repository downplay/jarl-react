import React from "react";
import styled from "react-emotion";

const Grid = styled.div`
    display: grid;
    grid-template-columns: 20rem 50% 50%;
    grid-template-rows: 20rem auto;
`;

const HeaderRow = styled.div`
    grid-column-start: 1;
    grid-column-end: 3;
`;

const MenuSidebar = styled.div``;
const ContentPanel = styled.div``;
const CodePanel = styled.div``;

const MainLayout = ({ children, code, menu }) => (
    <Grid>
        <HeaderRow>
            <h1>JARL Demos</h1>
        </HeaderRow>
        <MenuSidebar>{menu}</MenuSidebar>
        <ContentPanel>{children}</ContentPanel>
        <CodePanel>{code}</CodePanel>
    </Grid>
);

export default MainLayout;
