import React from "react";
import { routing, Link } from "jarl-react";

import PDF from "react-pdf-js";

class PdfViewer extends React.Component {
    state = {};

    onDocumentComplete = pages => {
        this.setState({ page: 1, pages });
    };

    onPageComplete = page => {
        this.setState({ page });
    };

    handlePrevious = () => {
        this.setState({ page: this.state.page - 1 });
    };

    handleNext = () => {
        this.setState({ page: this.state.page + 1 });
    };

    renderPagination = (page, pages) => {
        /**
         * Hook the pagination into our routing
         */
        const linkTo = newPage => {
            if (newPage < 1 || newPage > pages) {
                return null;
            }
            return { ...this.props.location, pageNumber: newPage };
        };
        const previousButton = (
            <li className="previous" onClick={this.handlePrevious}>
                <Link to={linkTo(page - 1)}>
                    <i className="fa fa-arrow-left" /> Previous
                </Link>
            </li>
        );
        const nextButton = (
            <li className="next" onClick={this.handleNext}>
                <Link to={linkTo(page + 1)}>
                    Next <i className="fa fa-arrow-right" />
                </Link>
            </li>
        );
        return (
            <nav>
                <ul className="pager">
                    {previousButton}
                    {nextButton}
                </ul>
            </nav>
        );
    };

    render() {
        let pagination = null;
        if (this.state.pages) {
            pagination = this.renderPagination(
                this.props.page,
                this.state.pages
            );
        }
        return (
            <div>
                <PDF
                    file={this.props.file}
                    onDocumentComplete={this.onDocumentComplete}
                    onPageComplete={this.onPageComplete}
                    page={this.props.page}
                />
                {pagination}
            </div>
        );
    }
}

export default routing(location => ({ location, page: location.pageNumber }))(
    PdfViewer
);
