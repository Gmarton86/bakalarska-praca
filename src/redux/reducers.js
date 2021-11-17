import {
  SET_PLAYER_NAME,
  SET_PLAYER_RANK,
  SET_TOURNAMENT_MATCHES,
  UPDATE_WINNER,
} from './actions'

const initialState = {
  name: '',
  rank: 0,
  matches: [],
}

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLAYER_NAME:
      return { ...state, name: action.payload }
    case SET_PLAYER_RANK:
      return { ...state, rank: action.payload }
    case SET_TOURNAMENT_MATCHES:
      return { ...state, matches: action.payload }
    case UPDATE_WINNER:
      return { ...state, matches: action.payload }
    default:
      return state
  }
}

export default playerReducer
