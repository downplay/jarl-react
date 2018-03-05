import React from "react";
import { Menu, MenuItem, SubMenu } from "./layout";

import demos from "./demos";

const MainMenu = () => (
    <Menu>
        <MenuItem to={{ page: "docs", docName: "getting-started" }}>
            Getting Started
        </MenuItem>
        <SubMenu title="Guides" />
        <SubMenu title="Demos">
            {demos.map(({ name, title }) => (
                <MenuItem key={name} to={{ page: "demo", demoName: name }}>
                    {title}
                </MenuItem>
            ))}
        </SubMenu>
        <SubMenu title="API Reference">
            <SubMenu title="JARL" />
            <SubMenu title="JARL Redux" />
        </SubMenu>
    </Menu>
);

export default MainMenu;
