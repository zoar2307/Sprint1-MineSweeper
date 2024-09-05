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
    renderBoard(gBoard)
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