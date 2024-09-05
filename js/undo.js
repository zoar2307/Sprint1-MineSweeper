'use strict'

var gLastSteps = []

function onUndoClicked() {
    if (gGame.shownCount === 0) return
    if (gLastSteps.length === 0) return
    var lastStep = gLastSteps.pop()
    console.log(lastStep);

    if (lastStep.length > 0) {
        for (var i = 0; i < lastStep.length; i++) {
            const currStep = lastStep[i]
            const value = getCellValue(currStep.i, currStep.j, gBoard)
            const elCell = document.querySelector(`.${getClassName(currStep)}`)
            const cell = gBoard[currStep.i][currStep.j]
            if (value === MINE) {
                elCell.classList.remove('boom')
            } else {
                elCell.classList.remove('showed')
            }
            renderCell(currStep, EMPTY)
            cell.isShown = false


        }
        return
    }

    const cell = gBoard[lastStep.i][lastStep.j]
    const value = getCellValue(lastStep.i, lastStep.j, gBoard)
    const elCell = document.querySelector(`.${getClassName(lastStep)}`)
    if (value === MINE) {
        elCell.classList.remove('boom')
    } else {
        elCell.classList.remove('showed')
    }
    cell.isShown = false
    renderCell(lastStep, EMPTY)







}









function recordStep(step) {
    gLastSteps.push(step)
}