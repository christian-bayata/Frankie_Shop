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
                "Content-Type": "multipart/form-data" 
            }
        }

        const { data } = await axios.post("/api/register", userData, config);

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

