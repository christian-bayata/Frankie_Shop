import {    USER_LOGIN_REQUEST, 
            USER_LOGIN_SUCCESS,
            USER_LOGIN_FAIL,
            USER_REGISTER_REQUEST,
            USER_REGISTER_SUCCESS,
            USER_REGISTER_FAIL,
            USER_LOAD_REQUEST,
            USER_LOAD_SUCCESS,    
            USER_LOAD_FAIL,
            USER_LOGOUT_SUCCESS,
            USER_LOGOUT_FAIL,
            CLEAR_ERRORS 
        } from "../constants/authConstant";

export const authReducer = (state = { user: {} }, action) => {
    switch(action.type) {
        case USER_LOGIN_REQUEST:
        case USER_REGISTER_REQUEST:
        case USER_LOAD_REQUEST:
            return {
                loading: true,
                isAuthenticated: false
            } 
        case USER_LOGIN_SUCCESS:
        case USER_REGISTER_SUCCESS:
        case USER_LOAD_SUCCESS: 
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.payload 
            } 

        case USER_LOGOUT_SUCCESS:
            return {
                loading: false,
                isAuthenticated: false,
                user: null
            }
        case USER_LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload
            }

        case USER_LOAD_FAIL: 
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }
        case USER_LOGIN_FAIL:
        case USER_REGISTER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
            }
        case CLEAR_ERRORS:
            return {
                ...state, 
                error: null
            }
        default: 
            return state
    }   
}
