import { ADD_LOGIN_FAILURE, ADD_LOGIN_REQUEST, ADD_LOGIN_SUCCESS, ADD_REGISTER_FAILURE, ADD_REGISTER_REQUEST, ADD_REGISTER_SUCCESS } from "./actionType";

export const addLoginRequest=(payload)=>({
    type:ADD_LOGIN_REQUEST,
    payload
})
export const addLoginFailure=(payload)=>({
    type:ADD_LOGIN_FAILURE,
    payload
})
export const addLoginSuccess=(payload)=>({
    type:ADD_LOGIN_SUCCESS,
    payload
})

export const addRegisterRequest=(payload)=>({
    type:ADD_REGISTER_REQUEST,
    payload
})
export const addRegisterFailure=(payload)=>({
    type:ADD_REGISTER_FAILURE,
    payload
})
export const addRegisterSuccess=(payload)=>({
    type:ADD_REGISTER_SUCCESS,
    payload
})