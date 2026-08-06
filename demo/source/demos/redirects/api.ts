/**
 * A fake async API to demonstrate resolver redirect
 */

const wait = (ms: number): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, ms));

interface ContentResult {
    title: string;
    body: string;
}

const api = {
    async get(slug: string): Promise<ContentResult> {
        await wait(300); // Simulate traffic
        if (slug === "about-us") {
            return {
                title: "About JARL",
                body: `
                <h2>jarl</h2>
                <aside>/jɑːl/</aside>
                <p><em><strong>noun</strong><span>historical</span></em></p>
                <h3>a Norse or Danish chief.</h3>
                `
            };
        }
        throw new Error(`Content was not found: '${slug}'`);
    }
};

export default api;
