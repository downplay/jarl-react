import React from "react";
import docs from "../docs/guides";
import { MarkdownJsx } from "../layout";

const Docs = ({ docName }) => <MarkdownJsx source={docs[docName]} />;

export default Docs;
