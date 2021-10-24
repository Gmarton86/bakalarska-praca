import { SET_PLAYER_NAME, SET_PLAYER_RANK } from './actions'

const initialState = {
    name: '',
    rank: 0,
}

export default function playerReducer(state = initialState, action) {
    switch (action.type) {
        case SET_PLAYER_NAME:
            return {...state, name: action.payload }
        case SET_PLAYER_RANK:
            return {...state, rank: action.payload }
        default:
            return state
    }
}