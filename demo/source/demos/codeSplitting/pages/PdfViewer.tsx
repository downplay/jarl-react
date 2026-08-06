import React from "react";
import { routing, Link } from "jarl-react";

import PDF from "react-pdf-js";

// `file` is passed in externally (BigPage.tsx); `location`/`page` are injected
// via the `routing` HOC below - a documented legacy-context dynamic boundary.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface PdfViewerProps {
    file: string;
    page?: number;
    location?: any;
}

interface PdfViewerState {
    page?: number;
    pages?: number;
}

class PdfViewer extends React.Component<PdfViewerProps, PdfViewerState> {
    state: PdfViewerState = {};

    onDocumentComplete = (pages: number) => {
        this.setState({ page: 1, pages });
    };

    onPageComplete = (page: number) => {
        this.setState({ page });
    };

    handlePrevious = () => {
        this.setState({ page: (this.state.page as number) - 1 });
    };

    handleNext = () => {
        this.setState({ page: (this.state.page as number) + 1 });
    };

    renderPagination = (page: number, pages: number) => {
        /**
         * Hook the pagination into our routing
         */
        const linkTo = (newPage: number) => {
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
                this.props.page as number,
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

// `TProps` is explicitly pinned to the externally-passed `file` prop only - without
// it, `TProps` would be inferred from `mapLocationToProps`'s return value instead,
// wrongly requiring callers (e.g. BigPage.tsx's `<PdfViewer file={bigPdf} />`) to
// also pass the HOC-injected `location`/`page` props themselves.
export default routing<{ file: string }>((location: any) => ({
    location,
    page: location.pageNumber
}))(PdfViewer as any);
