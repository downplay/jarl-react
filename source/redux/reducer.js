import { NAVIGATE_START, NAVIGATE_END, NAVIGATE_TRANSITION_IN, NAVIGATE_TRANSITION_COMPLETE } from "./defines";

const navigationReducer = (state = { isNavigating: false, isEntering: false }, action = {}) => {
    switch (action.type) {
        case NAVIGATE_START:
            return { ...state, isNavigating: true, isEntering: false };
        case NAVIGATE_END:
            return {
                ...state,
                isNavigating: false,
                isEntering: true,
                site: action.destination.site,
                page: action.destination.page
            };
        case NAVIGATE_TRANSITION_IN:
            return {
                ...state,
                isNavigating: false,
                isEntering: false
            };
        case NAVIGATE_TRANSITION_COMPLETE:
            return {
                ...state,
                isNavigating: false,
                isEntering: false
            };
        default:
            return state;
    }
};

export default navigationReducer;
