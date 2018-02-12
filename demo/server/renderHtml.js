import jsesc from "jsesc";

const renderStyle = href =>
    `<link rel="stylesheet" type="text/css" href="${href}"></link>`;
const renderScript = src =>
    `<script type="text/javascript" src="${src}" async></script>`;

const stringify = object =>
    `"${jsesc(JSON.stringify(object).replace(/</g, "\\u003c"), {
        quotes: "double"
    })}"`;

const renderHtml = ({
    appHtml = "",
    initialState,
    scripts = [],
    styles = [],
    styledTags = "",
    htmlAttributes = "",
    title = "",
    meta = "",
    link = "",
    bodyAttributes = ""
}) =>
    `<!doctype html>
    <html ${htmlAttributes.toString()}>
        <head>
            <meta charSet="utf-8" />
            <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            ${title.toString()}
            ${meta.toString()}
            ${link.toString()}
            ${styles.map(renderStyle).join("\n")}
            ${styledTags}
        </head>
        <body ${bodyAttributes.toString()}>
            <div id="root">${appHtml}</div>
            ${
                initialState
                    ? `<script type="text/javascript">
                            window.__INITIAL_STATE__ = ${stringify(
                                initialState
                            )};
                        </script>`
                    : ""
            }
            ${scripts.map(renderScript).join("\n")}
        </body>
    </html>
    `;

export default renderHtml;
