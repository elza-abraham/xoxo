import {Map} from 'immutable'

export const move = (turn, coords) => ({
  type: 'MOVE',
  position: coords,
  player: turn
})

export default function reducer(state = {board: Map(), turn: 'X'}, action) {
  if (action.type === 'MOVE'){
    let nextTurn = '';
    if (state.turn === 'X'){
      nextTurn = 'O'
    } else {
      nextTurn = 'X'
    }
    return {
      board: state.board.setIn(action.position, action.player),
      turn: nextTurn
    }
  }
  return state
}
