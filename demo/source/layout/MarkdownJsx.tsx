import React from "react";
import Markdown from "react-remarkable";
import Prism from "prismjs";
import { memoizeWith } from "ramda";

import "prismjs/components/prism-jsx";
import "prismjs/themes/prism.css";
import "prismjs/themes/prism-coy.css";

const highlight = (code: string, language = "jsx"): string => {
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

type DangerousHtmlFn = (source: string, language?: string) => { __html: string };

const dangerousHtml = memoizeWith<DangerousHtmlFn>(
    (source, language = "jsx") => `${language}:${source}`,
    (source, language = "jsx") => ({
        __html: Prism.highlight(source, Prism.languages[language], language)
    })
);

interface HighlightProps {
    source: string;
    // Accepted (passed by callers, e.g. MainLayout) but never actually used here -
    // preserved as-is from the original JS rather than "fixed" as part of this port.
    language?: string;
}

export const Highlight = ({ source }: HighlightProps) => (
    <pre className="language-js">
        <code
            className="language-js"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={dangerousHtml(source)}
        />
    </pre>
);

interface MarkdownJsxProps {
    source: string;
}

const MarkdownJsx = ({ source }: MarkdownJsxProps) => (
    <Markdown options={options} source={source} />
);

export default MarkdownJsx;
