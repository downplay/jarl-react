import React from "react";
import Markdown from "react-remarkable";
import docs from "../docs/guides";

const Docs = ({ docName }) => <Markdown source={docs[docName]} />;

export default Docs;
