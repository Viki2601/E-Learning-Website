import { combineReducers } from "redux";
import counterReducer from './counterReducers.js'
const reducers = combineReducers({
    counter:counterReducer
})

export default reducers