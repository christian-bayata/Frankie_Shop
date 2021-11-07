import {    USER_LOGIN_REQUEST, 
            USER_LOGIN_SUCCESS,
            USER_LOGIN_FAIL,
            USER_REGISTER_REQUEST,
            USER_REGISTER_SUCCESS,
            USER_REGISTER_FAIL,
            USER_LOAD_REQUEST,
            USER_LOAD_SUCCESS,    
            USER_LOAD_FAIL,
            UPDATE_PROFILE_REQUEST, 
            UPDATE_PROFILE_SUCCESS,
            UPDATE_PROFILE_RESET,
            UPDATE_PROFILE_FAIL,
            UPDATE_PASSWORD_REQUEST,
            UPDATE_PASSWORD_SUCCESS,
            UPDATE_PASSWORD_RESET,
            UPDATE_PASSWORD_FAIL,
            FORGOT_PASSWORD_REQUEST,
            FORGOT_PASSWORD_SUCCESS,
            FORGOT_PASSWORD_FAIL,
            NEW_PASSWORD_REQUEST,
            NEW_PASSWORD_SUCCESS,
            NEW_PASSWORD_FAIL,
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
            
        case USER_LOAD_FAIL: 
            return {
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload
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

export const userReducer = (state = {}, action) => {
    switch(action.type) {
        case UPDATE_PROFILE_REQUEST:
        case UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true, 
            }
 
        case UPDATE_PROFILE_SUCCESS:
        case UPDATE_PASSWORD_SUCCESS: 
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }

        case UPDATE_PROFILE_RESET: 
        case UPDATE_PASSWORD_RESET:
            return {
                ...state,
                isUpdated: false 
            }

        case UPDATE_PROFILE_FAIL: 
        case UPDATE_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default: 
            return state
    }
}
 
export const forgotPasswordReducer = (state = {}, action) => {
    switch(action.type) {
        case FORGOT_PASSWORD_REQUEST:
        case NEW_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
 
        case FORGOT_PASSWORD_SUCCESS: 
            return {
                ...state,
                loading: false,
                message: action.payload
            }
 
        case NEW_PASSWORD_SUCCESS:
            return {
                ...state,
                success: action.payload
            }   
            
        case FORGOT_PASSWORD_FAIL:
        case NEW_PASSWORD_FAIL:    
            return {
                ...state,
                loading: false,
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
