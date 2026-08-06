import React from "react";
import docs from "../docs/guides";
import { MarkdownJsx } from "../layout";

interface DocsProps {
    docName: string;
}

const Docs = ({ docName }: DocsProps) => (
    <MarkdownJsx source={docs[docName as keyof typeof docs]} />
);

export default Docs;
