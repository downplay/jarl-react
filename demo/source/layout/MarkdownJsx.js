import React from "react";
import Markdown from "react-remarkable";
import Prism from "prismjs";

import "prismjs/components/prism-jsx";
import "prismjs/themes/prism-coy.css";

const highlight = (code, language = "jsx") => {
    if (Prism.languages[language]) {
        try {
            return Prism.highlight(code, Prism.languages[language], language);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }
    // eslint-disable-next-line no-console
    console.error(`Language not found in Prism: ${language}`);
    return "";
};

const options = { highlight };

const MarkdownJsx = ({ source }) => (
    <Markdown options={options} source={source} />
);

export default MarkdownJsx;
