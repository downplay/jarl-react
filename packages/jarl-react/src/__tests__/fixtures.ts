import { staticRouteAtom, paramRouteAtom } from "jarl-atoms";

// Shared route atom fixtures used across the binding tests:
//   /               -> rootAtom (imported directly by tests that need it)
//   /about          -> aboutAtom
//   /about/team     -> teamAtom
//   /users          -> usersAtom
//   /users/:id      -> userAtom
export const aboutAtom = staticRouteAtom("about");
export const teamAtom = staticRouteAtom("team", { parent: aboutAtom });
export const usersAtom = staticRouteAtom("users");
export const userAtom = paramRouteAtom("id", { parent: usersAtom });
