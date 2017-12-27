import {
    NAVIGATE_START,
    NAVIGATE_END,
    NAVIGATE_TRANSITION_IN,
    NAVIGATE_TRANSITION_COMPLETE
} from "./defines";

export const navigateStart = (state, path) => ({
    type: NAVIGATE_START,
    destination: state,
    path
});
export const navigateEnd = (state, path) => ({
    type: NAVIGATE_END,
    destination: state,
    path
});

export const navigateTransitionIn = (state, path) => ({
    type: NAVIGATE_TRANSITION_IN,
    destination: state,
    path
});
export const navigateTransitionComplete = (state, path) => ({
    type: NAVIGATE_TRANSITION_COMPLETE,
    destination: state,
    path
});

export const navigate = ({ state }) => async dispatch => {
    await dispatch(navigateStart(state));
    await dispatch(navigateEnd(state));
    await dispatch(navigateTransitionIn(state));
};
