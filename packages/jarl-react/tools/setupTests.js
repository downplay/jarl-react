import { vi } from "vitest";
import { configure } from "enzyme";

// The legacy tests call `jest.fn()`/`jest.mock()` etc directly (a global
// under Jest). Alias it to vitest's equivalent so those tests keep working
// unmodified under Vitest.
globalThis.jest = vi;

// KNOWN ISSUE (ticket 51): there is no Enzyme adapter for React 19 — even
// the unofficial React 18 adapter fails to load because it pulls in
// react-shallow-renderer@16, which reaches into a React internals export
// (`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`) that no longer
// exists on React 19. Tests using `shallow`/`mount` in this package are
// expected to fail until they're ported off Enzyme (e.g. to
// @testing-library/react). See the ticket 51 PR description.
try {
    const { default: Adapter } = await import("@cfaester/enzyme-adapter-react-18");
    configure({
        adapter: new Adapter(),
    });
} catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
        "Enzyme adapter could not be configured (expected under React 19, " + "see ticket 51):",
        error.message,
    );
}
