export class Redirect {
    constructor(to) {
        this.to = to;
    }
}

const redirect = to => new Redirect(to);

export default redirect;
