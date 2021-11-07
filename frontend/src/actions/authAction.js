import axios from 'axios';

import {
            USER_LOGIN_REQUEST, 
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
            UPDATE_PROFILE_FAIL,
            UPDATE_PASSWORD_REQUEST,
            UPDATE_PASSWORD_SUCCESS,
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
        } from '../constants/authConstant';

//Login
export const login = (email, password) => async (dispatch) => {
    try {

        dispatch({type: USER_LOGIN_REQUEST})

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        const { data } = await axios.post("/api/login", { email, password }, config);

        dispatch({ 
            type: USER_LOGIN_SUCCESS, 
            payload: data.user
        }); 
    }
    catch(error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response.data.message
        })
    }
}

//Register User
export const register = (userData) => async (dispatch) => {
    try {

        dispatch({type: USER_REGISTER_REQUEST})

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        const { data } = await axios.post('/api/register', userData, config); 

        dispatch({ 
            type: USER_REGISTER_SUCCESS, 
            payload: data.user
        }); 
    }
    catch(error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response.data.message
        })
    }
} 

//Load User
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({type: USER_LOAD_REQUEST})
    
        const { data } = await axios.get("/api/me");

        dispatch({ 
            type: USER_LOAD_SUCCESS, 
            payload: data.user
        }); 
    }
    catch(error) {
        dispatch({
            type: USER_LOAD_FAIL,
            payload: error.response.data.message
        })
    }
}

//Update profile
export const updateUserProfile = (userData) => async (dispatch) => {
    try {

        dispatch({type: UPDATE_PROFILE_REQUEST})

        const config = {
            headers: {
                "Content-Type": "multipart/form-data" 
            }
        }

        const { data } = await axios.put("/api/me/update", userData, config);

        dispatch({ 
            type: UPDATE_PROFILE_SUCCESS, 
            payload: data.success
        }); 
    }
    catch(error) {
        dispatch({
            type: UPDATE_PROFILE_FAIL,
            payload: error.response.data.message
        })
    }
}

//Update password
export const updatePassword = (passwords) => async (dispatch) => {
    try {

        dispatch({type: UPDATE_PASSWORD_REQUEST})

        const config = {
            headers: {
                "Content-Type": "application/json" 
            }
        }

        const { data } = await axios.put("/api/password/update", passwords, config);

        dispatch({ 
            type: UPDATE_PASSWORD_SUCCESS, 
             payload: data.success
        }); 
    }
    catch(error) {
        dispatch({
            type: UPDATE_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}
 
//Forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {  

        dispatch({type: FORGOT_PASSWORD_REQUEST})

        const config = {
            headers: {
                "Content-Type": "application/json" 
            }
        }

        const { data } = await axios.post("/api/password/forgot", email, config);

        dispatch({ 
            type: FORGOT_PASSWORD_SUCCESS, 
             payload: data.message
        }); 
    }
    catch(error) {
        dispatch({
            type: FORGOT_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

//Reset password
export const resetPassword = (token, passwords) => async (dispatch) => {
    try {  

        dispatch({type: NEW_PASSWORD_REQUEST})

        const config = {
            headers: {
                "Content-Type": "application/json" 
            }
        }

        const { data } = await axios.put(`/api/password/reset/${token}`, passwords, config);

        dispatch({ 
            type: NEW_PASSWORD_SUCCESS, 
             payload: data.success
        }); 
    }
    catch(error) {
        dispatch({
            type: NEW_PASSWORD_FAIL,
            payload: error.response.data.message
        })
    }
}

//Logout User
export const logoutUser = () => async (dispatch) => {
    try {

        await axios.get("/api/logout");

        dispatch({ 
            type: USER_LOGOUT_SUCCESS  
        }); 
    }
    catch(error) {
        dispatch({
            type: USER_LOGOUT_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}

