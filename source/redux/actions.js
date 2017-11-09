import { NAVIGATE_START, NAVIGATE_END, NAVIGATE_TRANSITION_IN, NAVIGATE_TRANSITION_COMPLETE } from "./defines";

export const navigateStart = state => ({ type: NAVIGATE_START, destination: state });
export const navigateEnd = state => ({ type: NAVIGATE_END, destination: state });

export const navigateTransitionIn = state => ({ type: NAVIGATE_TRANSITION_IN, destination: state });
export const navigateTransitionComplete = state => ({ type: NAVIGATE_TRANSITION_COMPLETE, destination: state });

export const navigate = ({ state }) => async dispatch => {
    await dispatch(navigateStart(state));
    await dispatch(navigateEnd(state));
    await dispatch(navigateTransitionIn(state));
};
