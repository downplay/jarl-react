import React, { Component } from "react";
import styled from "react-emotion";
import { Subhead } from "rebass-emotion";

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
                    <Subhead>{header}</Subhead>
                </HeaderRow>
                <MenuSidebar>{menu}</MenuSidebar>
                <ContentPanel>{children}</ContentPanel>
            </Grid>
        );
    }
}

export default DemoLayout;
