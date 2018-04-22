import React from "react";
import Markdown from "react-remarkable";
import readme from "../../../README.md";

const About = () => <Markdown source={readme} />;

export default About;
