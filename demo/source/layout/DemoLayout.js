import React, { Component } from "react";
import styled from "react-emotion";
import { Header } from "semantic-ui-react";

const Grid = styled.div`
    display: grid;
`;

const HeaderRow = styled.div``;
const MenuSidebar = styled.div``;
const ContentPanel = styled.div``;

class DemoLayout extends Component {
    render() {
        const { header, children, menu } = this.props;
        return (
            <Grid>
                <HeaderRow>
                    <Header.Subheader>{header}</Header.Subheader>
                </HeaderRow>
                <MenuSidebar>{menu}</MenuSidebar>
                <ContentPanel>{children}</ContentPanel>
            </Grid>
        );
    }
}

export default DemoLayout;
