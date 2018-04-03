export class Redirect {
    constructor(to) {
        this.to = to;
    }
}

/**
 * Signals to initiate a redirect to another location. Can be returned from a state, match or resolve
 * function in a route.
 * @param {*} to - the location to be redirected to
 * @returns {Redirect}
 */
const redirect = to => new Redirect(to);

export default redirect;
