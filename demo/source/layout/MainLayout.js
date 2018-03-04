import React from "react";
import styled from "react-emotion";

const Grid = styled.div`
    display: grid;
`;

const HeaderRow = styled.div``;
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
