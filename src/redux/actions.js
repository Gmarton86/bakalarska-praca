export const SET_PLAYER_NAME = 'SET_PLAYER_NAME'
export const SET_PLAYER_RANK = 'SET_PLAYER_RANK'
export const SET_TOURNAMENT_MATCHES = 'SET_TOURNAMENT_MATCHES'
export const UPDATE_WINNER = 'UPDATE_WINNER'

export const setName = (name) => (dispatch) => {
  dispatch({
    type: SET_PLAYER_NAME,
    payload: name,
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
