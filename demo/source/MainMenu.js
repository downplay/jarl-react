import React from "react";
import { Menu, MenuItem, SubMenu } from "./layout";

import demos from "./demos";

const MainMenu = () => (
    <Menu>
        <MenuItem to={{ page: "docs", docName: "getting-started" }}>
            Getting Started
        </MenuItem>
        <SubMenu title="Guides">
            <MenuItem to={{ page: "docs", docName: "path-variables" }}>
                Path Variables
            </MenuItem>
            <MenuItem to={{ page: "docs", docName: "redux-integration" }}>
                Redux Integration
            </MenuItem>
            <MenuItem to={{ page: "docs", docName: "react-native" }}>
                React Native
            </MenuItem>
            <MenuItem to={{ page: "docs", docName: "data-loading" }}>
                Data Loading
            </MenuItem>
        </SubMenu>
        <SubMenu title="Demos" to={{ page: "index" }}>
            {demos.map(({ name, title }) => (
                <MenuItem
                    key={name}
                    to={{ page: "demo", demoName: name }}
                    data-test-demo-link={name}
                >
                    {title}
                </MenuItem>
            ))}
        </SubMenu>
        <SubMenu title="API Reference">
            <SubMenu title="JARL" to={{ page: "api", apiName: "jarl-react" }} />
            <SubMenu title="JARL Redux" />
        </SubMenu>
        <MenuItem to={{ page: "changelog" }}>Changelog</MenuItem>
    </Menu>
);

export default MainMenu;
