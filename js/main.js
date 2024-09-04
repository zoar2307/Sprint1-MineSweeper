'use strict'

const MINE = '💣'
const FLAG = '🚨'
const EMPTY = ''
const LIVES = 3
const HINTS = 3
const HEART_IMG = `<img class="heart" src="images/heart.webp" alt="Pixel-heart">`

var gBoard

var gLevel = {
    SIZE: 8,
    MINES: 14
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: LIVES,
    hints: HINTS
}

var gEmptyCells

var gIsHintOn = false
var gCurrHintButtonEl
var gTimerInterval
var gElapsedTime
var gTime






function onInit() {
    // Build the game Board 
    gBoard = buildBoard()

    // Render the game board to the dom
    renderBoard(gBoard)

    // Restart core setup
    updateLives()
    updateShownCount()
    updateMarkedCount()
    gGame.secsPassed = 0
    updateSmiley('🤩')
    gIsHintOn = false
    restartHints()
    restartTimer()

    // disable the contextmenu and detect right click
    const elGameContainer = document.querySelector('.game-container')
    elGameContainer.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        onCellMarked(e.target)
    });

    // Start the game
    gGame.isOn = true
}




// function that run on the empty cells and place in random cell Mine
function placeMineOnBoard(board) {
    var randomIdx = getRandomInt(0, gEmptyCells.length)
    var cell = gEmptyCells[randomIdx]

    gEmptyCells.splice(randomIdx, 1)
    // Modal
    board[cell.i][cell.j].isMine = true
}



// Detect click on cell
function onCellClicked(elCell, cellI, cellJ) {

    // if game is of its returns
    if (!gGame.isOn) return

    const cell = gBoard[cellI][cellJ]
    console.log(`cell:`, cell)
    var value = getCellValue(cellI, cellJ, gBoard)
    var location = { i: cellI, j: cellJ }

    // check if its first turn
    if (gGame.shownCount === 0) {
        startGameTimer()
        // check if its mine
        if (value === MINE) {

            // disbale the mine and counting the mine around
            cell.isMine = false
            cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)

            // get empty cells to put mine in empty cell
            getEmptyCells(gBoard)
            placeMineOnBoard(gBoard)

            if (value === EMPTY) {
                // if the cell is empty its open one deg
                var neighbors = getNonMineCellNegsList(cellI, cellJ, gBoard)
                showNeig(neighbors)
            }

        }
        // Modal
        cell.isShown = true
        updateShownCount(1)

        // DOM
        renderCell(location, getCellValue(cellI, cellJ, gBoard))
        elCell.classList.add('showed')

        // update all neig around count after adding a mine
        updateNeigAroundCount(gBoard)
        return
    }

    // update the values for each cell if there was change
    value = getCellValue(cellI, cellJ, gBoard)

    // if the cell is already opened return do nothing 
    if (cell.isShown) return

    if (gIsHintOn) {
        var neighbors = getCellNegsList(cellI, cellJ, gBoard)
        showNeig(neighbors)
        gCurrHintButtonEl.classList.add('invisible')
        gIsHintOn = false
        return
    }

    // if its opened a mine
    if (value === MINE) {

        if (gGame.lives === 0) {
            // if the live is 0 game is over
            isGameWon(false)
        }
        // Decrease one life
        updateLives(1)

        // Modal
        cell.isShown = true

        // Dom
        renderCell(location, value)
        elCell.classList.add('boom')

        return
    }

    if (value === EMPTY) {
        // if the cell is empty its open one deg
        var neighbors = getNonMineCellNegsList(cellI, cellJ, gBoard)
        showNeig(neighbors)
    }

    // Modal
    cell.isShown = true
    updateShownCount(1)

    // DOM
    cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)
    renderCell(location, value)
    elCell.classList.add('showed')

    // check if the game over
    if (checkGameOver()) isGameWon(true)
}




// mark with flag when right clicked on cell
function onCellMarked(elCell) {
    // If game is off it return
    if (!gGame.isOn) return

    // check if its the first click
    if (gGame.shownCount === 0) return

    // getting the cell pos by class
    var cellPos = getCellByClass(elCell.classList)
    var cell = gBoard[cellPos.i][cellPos.j]

    // if the cell already open it return
    if (cell.isShown) return


    // Modal
    cell.isMarked = !cell.isMarked
    var diff = cell.isMarked ? 1 : -1

    // update marked count
    updateMarkedCount(diff)

    // Dom
    var value = cell.isMarked ? FLAG : EMPTY
    renderCell(cellPos, value)

    // check if the game is over
    if (checkGameOver()) isGameWon(true)



}




// update the marked count
function updateMarkedCount(diff) {
    // var elMarked = 

    if (diff) {
        gGame.markedCount += diff
    } else {
        gGame.markedCount = 0
    }

    // elMarked.innerText = gGame.markedCount
}


// update the shown count
function updateShownCount(diff) {
    // var elShown

    if (diff) {
        gGame.shownCount += diff
    } else {
        gGame.shownCount = 0
    }

    // elShown.innerText = gGame.shownCount
}




// update the lives count
function updateLives(diff) {
    if (diff) {
        gGame.lives -= diff
    } else {
        gGame.lives = LIVES
    }
    if (gGame.lives >= 0) {
        renderLives()
    }

}


function renderLives() {
    var elLives = document.querySelector('.lives')

    var strHTML = ``

    for (var i = 0; i < gGame.lives; i++) {
        strHTML += HEART_IMG
    }
    elLives.innerHTML = strHTML
}




// check if the game is over
function checkGameOver() {
    return (gEmptyCells.length === gGame.shownCount && gGame.markedCount === gLevel.MINES ||
        gEmptyCells.length === gGame.shownCount && gGame.lives >= 0)
}




// tell us if we won or lost
function isGameWon(isWin) {
    stopGameTimer()
    if (isWin) {
        updateSmiley('😎')

    }
    if (!isWin) {
        updateSmiley('☠️')
        showAllMines()
    }
    gGame.isOn = false

}



// update the smileyface
function updateSmiley(smiley) {
    var elRestartSmiley = document.querySelector('.smiley')
    elRestartSmiley.innerText = smiley

}



// getting the empty cells
function getEmptyCells(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine !== true && board[i][j].isShown !== true) emptyCells.push({ i, j })
        }
    }
    gEmptyCells = emptyCells
}



// function the getting all mines position 
function findAllMines(board) {
    var mineCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true && board[i][j].isShown !== true) mineCells.push({ i, j })
        }
    }
    return mineCells
}



// show al the cells with mine
function showAllMines() {
    var mineCells = findAllMines(gBoard)
    for (var i = 0; i < mineCells.length; i++) {
        var mine = mineCells[i]
        renderCell(mine, MINE)
        var elCell = document.querySelector(`.cell-${mine.i}-${mine.j}`)
        elCell.classList.add('boom')
    }
}



// function that handle onHintClick
function onClickHint(elHint) {
    if (gGame.shownCount === 0) return
    gIsHintOn = !gIsHintOn
    if (gIsHintOn) {
        elHint.classList.add('clicked')
        gCurrHintButtonEl = elHint
    } else {
        elHint.classList.remove('clicked')
    }

}



function restartHints() {
    var hints = document.querySelectorAll('.hint')
    for (var i = 0; i < hints.length; i++) {
        var elHint = hints[i]
        elHint.classList.remove('invisible')
        elHint.classList.remove('clicked')
    }
}




function startGameTimer() {
    gElapsedTime = 0
    const start = Date.now();
    console.log(`start:`, start)
    gTimerInterval = setInterval(() => {
        gElapsedTime = Date.now() - start;
        var timer = gElapsedTime / 1000
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = timer.toFixed(0)
        gTime = timer.toFixed(0)
    }, 1000);

}



function stopGameTimer() {
    clearInterval(gTimerInterval)
    console.log(`gTime:`, gTime)
}

function restartTimer() {
    stopGameTimer()
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00'
}



function onClickLevel(size, mines) {
    gLevel.MINES = mines
    gLevel.SIZE = size
    onInit()
}