export const SET_PLAYER_NAME = 'SET_PLAYER_NAME';
export const SET_PLAYER_RANK = 'SET_PLAYER_RANK';

export const setName = name => dispatch => {
    dispatch({
        type: SET_PLAYER_NAME,
        payload: name,
    });
};

export const setRank = rank => dispatch => {
    dispatch({
        type: SET_PLAYER_RANK,
        payload: rank,
    });
};