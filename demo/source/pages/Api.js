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

const flattenParas = root =>
    root.children ? root.children.map(flattenParas).join("") : root.value || "";

const Description = ({ value }) => {
    let description = value;
    if (value && value.children) {
        description = flattenParas(value);
    }
    return <Markdown source={description} />;
};

const PropsHeaderRow = ({ showRequired }) => (
    <Table.Header>
        <Table.Row>
            <Table.HeaderCell>name</Table.HeaderCell>
            <Table.HeaderCell>type</Table.HeaderCell>
            <Table.HeaderCell>default</Table.HeaderCell>
            {showRequired && <Table.HeaderCell>required</Table.HeaderCell>}
            <Table.HeaderCell>description</Table.HeaderCell>
        </Table.Row>
    </Table.Header>
);

const PropsRow = ({
    name,
    type,
    defaultValue,
    required,
    description,
    showRequired
}) => (
    <Table.Row>
        <NameCell>{name}</NameCell>
        <CodeCell>{type}</CodeCell>
        <CodeCell>{defaultValue && defaultValue.value}</CodeCell>
        {showRequired && <CodeCell>{required && "required"}</CodeCell>}
        <Table.Cell>
            <Description value={description} />
        </Table.Cell>
    </Table.Row>
);

const ComponentApi = ({ item }) => (
    <Fragment>
        {item.description && <Markdown source={item.description} />}
        <Header sub>Props</Header>
        {item.props && (
            <Table>
                <PropsHeaderRow showRequired />
                <Table.Body>
                    {Object.entries(item.props).map(([name, prop]) => (
                        <PropsRow
                            {...{
                                ...prop,
                                name,
                                type: prop.type.name,
                                showRequired: true
                            }}
                            key={name}
                        />
                    ))}
                </Table.Body>
            </Table>
        )}
    </Fragment>
);

const translateType = type => {
    if (!type) {
        return "";
    }
    switch (type.type) {
        case "NameExpression":
            return type.name;
        case "AllLiteral":
            return "*";
        case "TypeApplication":
            return `${translateType(type.expression)}<${type.applications
                .map(translateType)
                .join(",")}>`;
        case "OptionalType":
            // TODO: These are for callbacks and should popup the callback detail
            return translateType(type.expression);
        default:
            // eslint-disable-next-line no-console
            console.log(type);
            return "unknown";
    }
};

const ClassParams = ({ item }) =>
    item.params && (
        <Table>
            <PropsHeaderRow />
            <Table.Body>
                {item.params.map(
                    ({
                        name,
                        default: defaultValue,
                        type,
                        required,
                        description
                    }) => (
                        <PropsRow
                            {...{
                                name,
                                type: translateType(type),
                                defaultValue,
                                required,
                                description
                            }}
                            key={name}
                        />
                    )
                )}
            </Table.Body>
        </Table>
    );

const Member = ({ member }) => (
    <Fragment>
        <Header as="h3">{member.displayName || member.name}</Header>
        {member.description && <Description value={member.description} />}
        <Header sub>Arguments</Header>
        <ClassParams item={member} />
    </Fragment>
);

const ClassApi = ({ item }) => (
    <Fragment>
        {item.description && <Description value={item.description} />}
        <Header sub>Constructor</Header>
        <ClassParams item={item} />
        <Header sub>Members</Header>
        {item.members.instance.map(member => (
            <Member
                item={item}
                member={member}
                key={member.displayName || member.name}
            />
        ))}
    </Fragment>
);

const ConstApi = ({ item }) => (
    <Fragment>
        {item.description && <Description value={item.description} />}
        <Header sub>Arguments</Header>
        <ClassParams item={item} />
    </Fragment>
);

const renderItem = item => {
    switch (item.kind) {
        case "component":
            return <ComponentApi item={item} />;
        case "class":
            return <ClassApi item={item} />;
        case "constant":
            return <ConstApi item={item} />;
        default:
            // eslint-disable-next-line no-console
            console.log(item);
            return null;
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
