import React, { Component } from "react";
import { compose, withState } from "recompose";

import { routing } from "jarl-react";

class SearchForm extends Component {
    handleChange = event => {
        this.props.setText(event.target.value);
    };

    handleClick = () => {
        this.props.navigate({
            page: "search",
            searchTerm: this.props.text,
            themeName: this.props.themeName
        });
    };

    render() {
        return (
            <div>
                <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.props.text}
                    data-test="search-text"
                />
                <button
                    type="button"
                    onClick={this.handleClick}
                    data-test="search-button"
                >
                    Search
                </button>
            </div>
        );
    }
}

export default compose(
    withState("text", "setText", ({ initialValue }) => initialValue || ""),
    // Inject a navigate function and also inspect location so we can preserve themeName
    // TODO: themeName can probably be preserved at the routes level now and the HOC is
    // not even needed here
    routing(
        ({ themeName }) => ({ themeName }),
        ({ navigate }) => ({ navigate })
    )
)(SearchForm);
