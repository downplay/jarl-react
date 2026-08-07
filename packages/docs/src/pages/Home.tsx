import readme from "../../../../README.md?raw";
import Markdown from "../lib/Markdown";

// Ported from the v1 demo site's About.js, which rendered the repo README at "/".
// Keeps a single source of truth for the intro copy instead of a duplicated page.
export const Home = () => <Markdown source={readme} />;

export default Home;
