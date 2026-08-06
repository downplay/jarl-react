import history from "../content/history.md?raw";
import Markdown from "../lib/Markdown";

// NEW page (ticket 58): documents the v1 implementation's architecture and design,
// and why v2 moves to jotai atoms. Distinct from Changelog.tsx, which just tracks
// version-by-version release notes.
export const History = () => <Markdown source={history} />;

export default History;
