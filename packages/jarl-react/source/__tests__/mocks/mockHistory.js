/* global jest */

const mockHistory = (pathname = "/", search = "") => ({
    listen: jest.fn(),
    location: {
        pathname,
        search
    },
    push: jest.fn(),
    replace: jest.fn()
});

export default mockHistory;
