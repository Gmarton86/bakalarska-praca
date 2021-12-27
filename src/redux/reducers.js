import {
  SET_USER_TYPE,
  SET_TRAINER_PASSWD,
  SET_PLAYER_RANK,
  SET_TOURNAMENT_MATCHES,
  UPDATE_WINNER,
  SET_ADMIN_ID,
 
} from './actions'

//user_name can be player, trainer, admin, 
const initialState = {
  userType: 'player',
  trainerPasswd: '',
  rank: 0,
  matches: [],
  adminID: '',
}

function playerReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_TYPE:
      return { ...state, userType: action.payload }
    case SET_TRAINER_PASSWD:
      return { ...state, trainerPasswd: action.payload }
    case SET_PLAYER_RANK:
      return { ...state, rank: action.payload }
    case SET_TOURNAMENT_MATCHES:
      return { ...state, matches: action.payload }
    case UPDATE_WINNER:
      return { ...state, matches: action.payload }
    case SET_ADMIN_ID:
      return { ...state, adminID: action.payload }
    default:
      return state
  }
}

export default playerReducer
