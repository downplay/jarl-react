import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NativeProvider, Router, Link } from "jarl-react-native";

import routes from "./routes";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});

export default class App extends React.Component {
    state = { location: null };

    handleChange = ({ location }) => {
        this.setState({ location });
    };

    render() {
        return (
            <NativeProvider
                routes={routes}
                location={this.state.location}
                onChange={this.handleChange}
            >
                <View style={styles.container}>
                    <Router>
                        {({ page }) => {
                            switch (page) {
                                case "home":
                                    return (
                                        <Fragment>
                                            <Text>Home page</Text>
                                        </Fragment>
                                    );
                                case "page2":
                                    return (
                                        <Fragment>
                                            <Text>Page 2</Text>
                                        </Fragment>
                                    );
                                default:
                                    return null;
                            }
                        }}
                    </Router>
                    <Link to={{ page: "home" }}>Home</Link>
                    <Link to={{ page: "page2" }}>Page 2</Link>
                </View>
            </NativeProvider>
        );
    }
}
