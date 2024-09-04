'use strict'



// function that build our board(matrix)
function buildBoard() {
    const board = []
    const length = gLevel.SIZE

    for (var i = 0; i < length; i++) {
        board[i] = []

        for (var j = 0; j < length; j++) {
            var cell = {
                minesAround: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // gets all empty cells after the first click
    getEmptyCells(board)

    // placing the mines
    for (var i = 0; i < gLevel.MINES; i++) {
        placeMineOnBoard(board)
    }

    return board
}





// function that render the board we made to the dom
function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            cell.minesAround = setMinesNegsCount(i, j, board)
            const className = cell.isShown ? `cell cell-${i}-${j} showed` : `cell cell-${i}-${j}`


            strHTML += `<td class="${className}" 
                            onclick="onCellClicked(this , ${i},${j})">
                            ${EMPTY}
                        </td>`
        }
        strHTML += '</tr>'
    }


    // render the board to HTML
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}
