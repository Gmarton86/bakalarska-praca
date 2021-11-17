import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import playerReducer from './reducers'

const rootReducer = combineReducers({ playerReducer })

export const Store = createStore(rootReducer, applyMiddleware(thunk))
