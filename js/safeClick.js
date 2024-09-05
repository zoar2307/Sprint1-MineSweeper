'use strict'

function onSafeClicked() {
    if (gGame.shownCount === 0) return
    if (gGame.safeClick === 0) return
    updateSafeClick(1)
    var randomIdx = getRandomInt(0, gEmptyCells.length)
    var cell = gEmptyCells[randomIdx]

    var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
    elCell.classList.add('safeclick')

    setTimeout(() => {
        var elCell = document.querySelector(`.cell-${cell.i}-${cell.j}`)
        elCell.classList.remove('safeclick')

    }, 1000)
}



