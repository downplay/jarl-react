import React from "react";
import PdfViewer from "./PdfViewer";

import { Page, Header, Body } from "../../../layout";

const BigPage = () => (
    <Page>
        <Header>REALLY BIG PAGE</Header>
        <Body>
            <PdfViewer file="http://www.his.se/PageFiles/10362/Katz-Free%20and%20Open%20Source%20Software%20Stockholm%202013-11-22.pdf" />
        </Body>
    </Page>
);

export default BigPage;
