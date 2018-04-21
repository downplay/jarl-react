import React from "react";
import Markdown from "react-remarkable";
import changelog from "../../../CHANGELOG.md";

const Changelog = () => <Markdown source={changelog} />;

export default Changelog;
