export class Redirect {
    to: LocationValue;

    constructor(to: LocationValue) {
        this.to = to;
    }
}

/**
 * A location object or path string. Route state is intentionally left as an
 * open-ended dynamic bag - it's whatever shape the consuming application's
 * routes define, which isn't something this library can usefully constrain.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LocationValue = string | Record<string, any>;

/**
 * Signals to initiate a redirect to another location. Can be returned from a state, match or resolve
 * function in a route.
 * @param to - the location to be redirected to
 */
const redirect = (to: LocationValue): Redirect => new Redirect(to);

export default redirect;
