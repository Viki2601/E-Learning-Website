import { counter } from "@fortawesome/fontawesome-svg-core"

export const searchQuery =(counter)=>{
    return (dispatch)=>{
        dispatch({
            type:"searchQuery",
            payload:counter
        })
    }
}

export const SingleItemPageObj=(counter)=>{
    return (dispatch)=>{
        dispatch({
            type:'SingleItemPageObj',
            payload:counter
        })
    }
}

export const CartPageObj = (counter)=>{
    return(dispatch)=>{
        dispatch({
            type: 'CartPageObj',
            payload:counter
        })
    }
}