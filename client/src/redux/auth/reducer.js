import { ADD_LOGIN_REQUEST } from "./actionType"

const init={
    isLoading:false,
    isError:false,
    isAuth:false,
}

export const authReducer=(store=init,{type,payload})=>{
    switch(type){
        case ADD_LOGIN_REQUEST:
            return {...store,isLoading:true}
        default:
            return {...store}


    }
}