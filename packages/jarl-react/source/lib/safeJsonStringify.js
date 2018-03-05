const safeJsonStringify = o => {
    try {
        return JSON.stringify(o);
    } catch (e) {
        return "[Circular reference]";
    }
};

export default safeJsonStringify;
