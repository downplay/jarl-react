import React, { Component } from "react";
import { compose, withState } from "recompose";

import { routing, RoutingCallbacks } from "jarl-react";

// Props here are a mix of what `recompose`'s `withState`/`compose` and jarl-react's
// `routing` HOC inject (text, setText, navigate, themeName) plus `initialValue`
// passed in externally - not staticly reconcilable through these HOCs' generic
// typing, so this component (and its final export below) stays `any`-typed, a
// deliberate dynamic-boundary choice given both `recompose` and legacy-context
// HOC prop injection are documented `any` boundaries for this port.
/* eslint-disable @typescript-eslint/no-explicit-any */
class SearchForm extends Component<any> {
    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

// The whole exported component (not just `SearchForm as any` above) is cast to `any`:
// `compose`/`withState` from `recompose` (untyped for this old version - see the
// file-level comment) don't propagate a usable prop type through to the result, so
// there's nothing meaningful left for TS to check here regardless of how precisely
// `routing`'s own callbacks below are typed.
export default compose(
    withState("text", "setText", ({ initialValue }: any) => initialValue || ""),
    // Inject a navigate function and also inspect location so we can preserve themeName
    // TODO: themeName can probably be preserved at the routes level now and the HOC is
    // not even needed here
    routing(
        ({ themeName }: any) => ({ themeName }),
        ({ navigate }: RoutingCallbacks) => ({ navigate })
    )
)(SearchForm as any) as any;
