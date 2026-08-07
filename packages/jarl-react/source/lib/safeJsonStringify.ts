const safeJsonStringify = (o: unknown): string | undefined => {
    try {
        return JSON.stringify(o);
    } catch (e) {
        return "[Circular reference]";
    }
};

export default safeJsonStringify;
