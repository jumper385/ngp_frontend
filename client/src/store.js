import { createStore } from 'redux'
import { combineReducers  } from 'redux'

const baseFunctions = (state = {}, action) => {
    switch(action.type){
        case 'ADD_API_BASE_URL':
            let base = action.payload
            state = {...state, base_url:base}
            return state
        default:
            return state
    }
} 

const recording = (state = {recording_id:'', log_history:[], isRecording:false}, action) => {
    switch(action.type){
        case 'START_RECORDING':
            const { shortid, timestamp, notes } = action.payload
            console.log(shortid, timestamp, notes)
            state = {...state, isRecording:true, recording_id:shortid}
            state = {...state, log_history:[]}
            console.log(state)
            return state
        case 'APPEND_LOG':
            state = {...state, log_history:[...state.log_history, action.payload]}
            return state
        case 'STOP_RECORDING':
            state = {...state, isRecording:false}
            return state
        default:
            return state
    }
}

const newLog = (state = [], action) => {
    switch(action.type){
        case 'NEW_LOG':
            state = {...state, ...action.payload}
            return state
        case 'APPEND_LOG':
            state = {recording_id:'',symptom:'',severity:'', location:'',notes:''}
            return state
        default:
            return state
    }
}

const overallLogs = (state = [], action) => {
    switch(action.type){
        case 'NEW_OVERALL':
            state = {...state, ...action.payload}
            return state
        default:
            return state
    }
}

const rootReducer = combineReducers({
    baseFunctions,
    newLog,
    recording
})

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store