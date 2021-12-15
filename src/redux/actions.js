export const SET_USER_TYPE = 'SET_USER_TYPE'
export const SET_PLAYER_RANK = 'SET_PLAYER_RANK'
export const SET_TOURNAMENT_MATCHES = 'SET_TOURNAMENT_MATCHES'
export const UPDATE_WINNER = 'UPDATE_WINNER'

export const setUserType = (userType) => (dispatch) => {
  dispatch({
    type: SET_USER_TYPE,
    payload: userType,
  })
}

export const setRank = (rank) => (dispatch) => {
  dispatch({
    type: SET_PLAYER_RANK,
    payload: rank,
  })
}

export const setMatches = (matches) => (dispatch) => {
  dispatch({
    type: SET_TOURNAMENT_MATCHES,
    payload: matches,
  })
}

export const updateWinner = (matches) => (dispatch) => {
  dispatch({
    type: UPDATE_WINNER,
    payload: matches,
  })
}
