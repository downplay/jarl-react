/* global jest */

const mockHistory = (pathname = "/", search = "") => ({
    listen: vi.fn(),
    location: {
        pathname,
        search,
    },
    push: vi.fn(),
    replace: vi.fn(),
});

export default mockHistory;
