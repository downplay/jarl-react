import React from "react";
import PdfViewer from "./PdfViewer";

import bigPdf from "./Game_Programming_lecture.pdf";

import { Page, Header, Body } from "../../../layout";

const BigPage = () => (
    <Page>
        <Header>REALLY BIG PAGE</Header>
        <Body>
            <PdfViewer file={bigPdf} />
        </Body>
    </Page>
);

export default BigPage;
