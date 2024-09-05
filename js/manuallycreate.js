'use strict'



var gIsManuallyCreateOn = false
var gIsManuallyCreatedBoard = false
var gCountManuallyMines = 0

function onManuallyCreate(elBtn) {
    if (gGame.shownCount !== 0) return
    if (gIsManuallyCreateOn) {
        gIsManuallyCreateOn = false
        gCountManuallyMines = 0
        clearCells(gMineCells, true, gBoard)
        gMineCells = []
        elBtn.classList.remove('manually')
        elBtn.innerText = `Manually`

    } else {
        elBtn.classList.add('manually')
        gIsManuallyCreateOn = true
    }

}

function placeManuallyMineOnBoard(i, j, board) {
    var pos = { i, j }
    var elBtn = document.querySelector('.manually-btn')
    if (board[i][j].isMine === true) return
    console.log(pos);
    gMineCells.push(pos)
    gCountManuallyMines++
    board[i][j].isMine = true

    renderCell(pos, MINE)

    console.log(gCountManuallyMines);
    elBtn.innerText = `${gCountManuallyMines} / ${gLevel.MINES}`
    if (gCountManuallyMines === gLevel.MINES) {
        gCountManuallyMines = 0
        gIsManuallyCreatedBoard = true
        gIsManuallyCreateOn = false
        updateMarkedCount()
        elBtn.classList.remove('manually')
        elBtn.innerText = `Manually`
        clearCells(gMineCells, false, board)
    }
}


function clearCells(cells, isIncludeModel, board) {

    for (var i = 0; i < cells.length; i++) {
        var currCell = cells[i]
        renderCell(currCell, EMPTY)
        if (isIncludeModel) {

            board[currCell.i][currCell.j].isMine = false
        }
    }
}