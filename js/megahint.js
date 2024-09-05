'use strict'


var gFirstClick
var gSecondClick

function onMegaHintClicked() {
    if (gGame.shownCount === 0) return
    gIsMegaHintOn = true
    alert('click the areas top-left')

}

function showMegaHint() {
    var cellToShow = []
    for (var i = gFirstClick.i; i <= gSecondClick.i; i++) {
        for (var j = gFirstClick.j; j <= gSecondClick.j; j++) {
            var cell = { i, j }
            if (gBoard[i][j].isMarked === true) continue
            cellToShow.push(cell)
        }
    }
    showCells(cellToShow, 2000)
    gIsMegaHintOn = false
    gFirstClick = null
    gSecondClick = null

}





function captureFirstClick(cellI, cellJ) {
    console.log(cellI);
    console.log(cellJ);

    gFirstClick = { i: cellI, j: cellJ }
}

function captureSecondClick(cellI, cellJ) {
    console.log(cellI);
    console.log(cellJ);
    gSecondClick = { i: cellI, j: cellJ }
}