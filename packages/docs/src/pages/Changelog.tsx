import changelog from "../../../../CHANGELOG.md?raw";
import Markdown from "../lib/Markdown";

// Just tracks version history - distinct from the new History page, which documents
// the v1 architecture and why v2 moved to atoms.
export const Changelog = () => <Markdown source={changelog} />;

export default Changelog;
