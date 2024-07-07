const initialState = {
    loading: false,
    user: {},
    error: null
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_DETAILS_REQUEST':
            return { ...state, loading: true };
        case 'USER_DETAILS_SUCCESS':
            return { loading: false, user: action.payload, error: null };
        case 'USER_DETAILS_FAIL':
            return { loading: false, user: {}, error: action.payload };
        default:
            return state;
    }
};

export default userReducer;