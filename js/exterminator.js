'use strict'


function onExterminatorClicked() {
    if (gGame.shownCount === 0) return
    var length = gMineCells.length > 2 ? 3 : 1
    if (gMines === 1) return
    var elCells = []
    for (var i = 0; i < length; i++) {

        var randomIdx = getRandomInt(0, gMineCells.length)
        var cell = gMineCells[randomIdx]
        console.log(gMineCells);
        console.log(cell);

        gMineCells.splice(randomIdx, 1)
        // Modal
        gBoard[cell.i][cell.j].isMine = false


        var elCell = document.querySelector(`.${getClassName(cell)}`)
        elCells.push(elCell)
        console.log(elCells);
    }
    setMinesNegsCount(gBoard)
    updateAllCellsValue(gBoard)
    gMines -= length
    var counted = gGame.markedCount

    updateMarkedCount()
    updateMarkedCount(counted)
    for (var i = 0; i < elCells.length; i++) {
        elCells[i].classList.add('removed')
    }

    setTimeout(() => {
        for (var i = 0; i < elCells.length; i++) {
            elCells[i].classList.remove('removed')
        }
    }, 500)

}


function updateAllCellsValue(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown === false) continue
            var cell = { i, j }
            var value = getCellValue(i, j, board)
            renderCell(cell, value)
        }
    }
}