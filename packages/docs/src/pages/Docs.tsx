import gettingStarted from "../../../../demo/source/docs/guides/GettingStarted.md?raw";
import dataLoading from "../../../../demo/source/docs/guides/DataLoading.md?raw";
import pathVariables from "../../../../demo/source/docs/guides/PathVariables.md?raw";
import reactNative from "../../../../demo/source/docs/guides/ReactNative.md?raw";
import reduxIntegration from "../../../../demo/source/docs/guides/ReduxIntegration.md?raw";
import Markdown from "../lib/Markdown";
import { Link } from "../router/Link";
import { docPageRoute, docPages, DocName } from "../router/routes";

const guides: Record<DocName, string> = {
    "getting-started": gettingStarted,
    "data-loading": dataLoading,
    "path-variables": pathVariables,
    "react-native": reactNative,
    "redux-integration": reduxIntegration
};

export const DocsIndex = () => (
    <>
        <h1>Docs</h1>
        <p>Guides for using JARL v1, the published controlled-component router.</p>
        <ul className="doc-index">
            {docPages.map(({ docName, title }) => (
                <li key={docName}>
                    <Link route={docPageRoute} to={{ docName }}>
                        {title}
                    </Link>
                </li>
            ))}
        </ul>
    </>
);

export const DocPage = ({ docName }: { docName: string }) => {
    const source = guides[docName as DocName];
    if (!source) {
        return (
            <>
                <h1>Not found</h1>
                <p>
                    No guide named &ldquo;{docName}&rdquo;. Back to <Link route={docPageRoute} to={{ docName: docPages[0].docName }}>Docs</Link>.
                </p>
            </>
        );
    }
    return <Markdown source={source} />;
};

export default DocsIndex;
