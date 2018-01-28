import React, { Component } from "react";
import { compose, withState } from "recompose";

import { withNavigate } from "jarl-react";

class SearchForm extends Component {
    handleChange = event => {
        this.props.setText(event.target.value);
    };

    handleClick = () => {
        this.props.navigate({ page: "search", searchText: this.props.text });
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

export default compose(withState("text", "setText", ""), withNavigate())(
    SearchForm
);
