import {Map} from 'immutable'

export const move = (turn, coords) => ({
  type: 'MOVE',
  position: coords,
  player: turn
})

const turnReducer = (turn = 'X', action) => {
  let nextTurn = '';

  if (action.type === 'MOVE'){

    if (turn === 'X'){
      nextTurn = 'O';
    } else {
      nextTurn = 'X';
    }

    return nextTurn;
  }

  return turn;
}

const boardReducer = (board = Map(), action) => {
  if (action.type === 'MOVE'){
    return board.setIn(action.position, action.player)
  }

  return board;
}

export default function reducer(state = {}, action) {
  const error = bad(state, action)
  console.log(error)
  if (!error){
    const newBoard = boardReducer(state.board, action);
    return {
      board: newBoard,
      turn: turnReducer(state.turn, action),
      winner: winner(newBoard)
    }
  } else {
    // return ({...state, error: error})
    return Object.assign({}, state, error)
  }
}

function winner(board) {

  const playerWins =
    streak(board, [0, 0], [0, 1], [0, 2]) ||
    streak(board, [1, 0], [1, 1], [1, 2]) ||
    streak(board, [2, 0], [2, 1], [2, 2]) ||
    streak(board, [0, 0], [1, 0], [2, 0]) ||
    streak(board, [0, 1], [1, 1], [2, 1]) ||
    streak(board, [0, 2], [1, 2], [2, 2]) ||
    streak(board, [0, 0], [1, 1], [2, 2]) ||
    streak(board, [0, 2], [1, 1], [2, 0])

  if (playerWins) {
    return playerWins + ' wins the game';
  }
  else {
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (!board.hasIn([x, y])) {
          return null;
        }
      }
    }
  }

  return 'Draw'
}

function streak(board, firstCoord, ...remainingCoords) {
  const player = board.getIn(firstCoord);

  const win = remainingCoords.every(coord => {
    return board.getIn(coord) === player;
  })

  if (win) {
    return player
  }
}

function bad(state, action){
  // const position = action.position || []
  // const board = state.board || Map()
  if (action.position){
    if (action.player !== state.turn){
      return 'Note your turn'
    }
    action.position.forEach((coord) => {
      if (coord < 0 || coord > 2){
        return 'Invalid position!'
      }
    })
  }
  if (state.board){
    if (state.board.hasIn(action.position)) {
      return 'square already taken';
    }
  }
}
