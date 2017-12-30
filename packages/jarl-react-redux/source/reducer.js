import {
    NAVIGATE_START,
    NAVIGATE_END,
    NAVIGATE_TRANSITION_BEGIN,
    NAVIGATE_TRANSITION_IN,
    NAVIGATE_TRANSITION_COMPLETE
} from "./actionTypes";

const navigationReducer = (
    state = {
        isNavigating: false,
        isEntering: false,
        isTransitioning: false,
        location: null,
        path: "",
        destination: null
    },
    action = {}
) => {
    switch (action.type) {
        case NAVIGATE_START:
            return { ...state, isNavigating: true };
        case NAVIGATE_END:
            return {
                ...state,
                isNavigating: false,
                path: action.path,
                location: action.destination
            };
        case NAVIGATE_TRANSITION_BEGIN:
            return {
                ...state,
                isEntering: true,
                isTransitioning: true
            };
        case NAVIGATE_TRANSITION_IN:
            return {
                ...state,
                isEntering: false
            };
        case NAVIGATE_TRANSITION_COMPLETE:
            return {
                ...state,
                isTransitioning: false
            };
        default:
            return state;
    }
};

export default navigationReducer;
