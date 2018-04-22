import React, { Fragment } from "react";
import styled from "react-emotion";

import { Header, Menu, Segment, Table } from "semantic-ui-react";
import Markdown from "react-remarkable";

import { Page, Header as MainHeader, Body, MenuItem } from "../layout";

import apiContent from "../docs/api";

const toApi = apiName => ({ page: "api", apiName });

const apis = [
    {
        name: "jarl-react",
        title: "JARL"
    },
    {
        name: "jarl-react-native",
        title: "JARL Native"
    }
];
const apiTitle = apiName => apis.find(api => api.name === apiName).title;

const Paragraph = text => (
    // eslint-disable-next-line react/no-danger
    <Markdown source={text} />
);

const Line = line => (
    <Fragment>
        {typeof line === "string" && <Markdown source={line} />}
        {line.type === "text" && Paragraph(line.value)}
        {line.children && line.children.map(Line)}
    </Fragment>
);

// eslint-disable-next-line react/no-array-index-key
const Row = ({ cells }) => cells.map((cell, i) => <td key={i}>{cell}</td>);

const PreCell = ({ children, ...rest }) => (
    <Table.Cell {...rest}>
        <pre>{children}</pre>
    </Table.Cell>
);

const NameCell = styled(PreCell)`
    font-weight: bold;
`;

const CodeCell = styled(PreCell)`
    font-style: italic;
`;

const ComponentApi = ({ item }) => (
    <Fragment>
        <Header sub>Details</Header>
        <Markdown source={item.description} />
        <Header sub>Props</Header>
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>name</Table.HeaderCell>
                    <Table.HeaderCell>type</Table.HeaderCell>
                    <Table.HeaderCell>default</Table.HeaderCell>
                    <Table.HeaderCell>required</Table.HeaderCell>
                    <Table.HeaderCell>description</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            {item.props && (
                <Table.Body>
                    {Object.entries(item.props).map(([name, prop]) => (
                        <Table.Row key={name}>
                            <NameCell>{name}</NameCell>
                            <CodeCell>{prop.type.name}</CodeCell>
                            <CodeCell>
                                {prop.defaultValue && prop.defaultValue.value}
                            </CodeCell>
                            <CodeCell>{prop.required && "required"}</CodeCell>
                            <Table.Cell>
                                <Markdown source={prop.description} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            )}
        </Table>
    </Fragment>
);

const ClassApi = ({ item }) => (
    <Fragment>
        <Header sub>Constructor</Header>
        <table>
            {item.params.map(({ title, name, default: def, description }) => (
                <Row cells={[title, name, def, description]} />
            ))}
        </table>
        <Header sub>Methods</Header>
    </Fragment>
);

const renderItem = item => {
    switch (item.kind) {
        case "component":
            return <ComponentApi item={item} />;
        case "class":
            return <ClassApi item={item} />;
        default:
            return <pre>{JSON.stringify(item, null, "  ")}</pre>;
    }
};

const Api = ({ apiName }) => (
    <Page>
        <Menu pointing>
            {apis.map(({ name, title }) => (
                <MenuItem key={name} to={toApi(name)}>
                    {title}
                </MenuItem>
            ))}
        </Menu>
        <MainHeader>{apiTitle(apiName)} API Reference</MainHeader>
        <Body>
            {apiContent[apiName].map(item => (
                <Segment key={item.displayName || item.name}>
                    <Header as="h2">{item.displayName || item.name}</Header>
                    {renderItem(item)}
                </Segment>
            ))}
        </Body>
    </Page>
);

export default Api;
