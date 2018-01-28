/* global jest */

const mockHistory = (pathname = "/") => ({
    listen: jest.fn(),
    location: {
        pathname
    },
    push: jest.fn()
});

export default mockHistory;
