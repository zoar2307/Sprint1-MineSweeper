'use strict'

const MINE = '💣'
const FLAG = '⌖'
const EMPTY = ''
const LIVES = 3
const HINTS = 3
const HEART_IMG = `<img class="heart" src="images/heart.webp" alt="Pixel-heart">`
const SAFE_CLICK = 3


var gBoard




var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gMines

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: LIVES,
    hints: HINTS,
    safeClick: SAFE_CLICK
}

var gEmptyCells
var gMineCells

var gIsHintOn = false
var gIsMegaHintOn = false
var gMegaHintClickCount = 1
var gCurrHintButtonEl
var gTimerInterval
var gElapsedTime








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
    updateSafeClick()
    updateScore()
    gLastSteps = []
    gMines = gLevel.MINES



    // Start the game
    gGame.isOn = true
}

// disable the contextmenu and detect right click
const elGameContainer = document.querySelector('.game-container')
elGameContainer.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    onCellMarked(e.target)
});




// Detect click on cell
function onCellClicked(elCell, cellI, cellJ) {

    // if game is of its returns
    if (!gGame.isOn) return

    const cell = gBoard[cellI][cellJ]
    if (cell.isShown) return

    // check if its first turn
    if (gGame.shownCount === 0) {
        startGameTimer()

        cell.isShown = true
        cell.isMine = false

        updateShownCount(1)



        gEmptyCells = getEmptyCells(gBoard)
        console.log(gEmptyCells);

        // placing the mines
        for (var i = 0; i < gLevel.MINES; i++) {
            placeMineOnBoard(gBoard)
        }
        gMineCells = findAllMines(gBoard)
        updateMarkedCount()




    }

    setMinesNegsCount(gBoard)
    const value = getCellValue(cellI, cellJ, gBoard)
    const location = { i: cellI, j: cellJ }


    // if the cell is already opened return do nothing 

    if (gIsHintOn) {
        var neighbors = getCellNegsList(cellI, cellJ, gBoard)
        showCells(neighbors, 1000)
        gCurrHintButtonEl.classList.add('invisible')
        gIsHintOn = false
        return
    }
    if (gIsMegaHintOn && gGame.shownCount !== 1) {
        if (gMegaHintClickCount === 1) {
            captureFirstClick(cellI, cellJ)
            gMegaHintClickCount++
            alert('click the areas bottom-right cell')
        } else if (gMegaHintClickCount === 2) {
            captureSecondClick(cellI, cellJ)
            gMegaHintClickCount = 1
            showMegaHint()
        }
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
        recordStep(location)
        return
    }

    if (value === EMPTY) {
        // if the cell is empty its open one deg
        var neighbors = getNonMineCellNegsList(cellI, cellJ, gBoard)
        recordStep(location)
        // showNeig(neighbors)
        expandShown(gBoard, elCell, cellI, cellJ)
    }
    else {
        recordStep(location)

    }



    // Modal
    cell.isShown = true

    // DOM
    cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)
    renderCell(location, value)
    elCell.classList.add('showed')


    updateShownCount(1)


    // check if the game over
    if (checkGameOver()) isGameWon(true)
}






// function that run on the empty cells and place in random cell Mine
function placeMineOnBoard(board) {

    var randomIdx = getRandomInt(0, gEmptyCells.length)
    var cell = gEmptyCells[randomIdx]

    gEmptyCells.splice(randomIdx, 1)
    // Modal
    board[cell.i][cell.j].isMine = true
}



// mark with flag when right clicked on cell
function onCellMarked(elCell) {
    // If game is off it return
    if (!gGame.isOn) return

    // check if its the first click
    if (gGame.shownCount === 0) return

    console.log(elCell.classList);
    // getting the cell pos by class
    var cellPos = getCellByClass(elCell.classList)
    var cell = gBoard[cellPos.i][cellPos.j]

    console.log(cellPos);

    // if the cell already open it return
    if (cell.isShown) return


    // Modal
    if (cell.isMarked) {
        cell.isMarked = false
        var diff = -1
        elCell.classList.remove('marked')

    } else {
        cell.isMarked = true
        var diff = 1
        elCell.classList.add('marked')

    }
    // cell.isMarked = !cell.isMarked
    // var diff = cell.isMarked ? 1 : -1

    // update marked count
    updateMarkedCount(diff)

    // Dom
    var value = cell.isMarked ? FLAG : EMPTY
    renderCell(cellPos, value)

    // // check if the game is over
    if (checkGameOver()) isGameWon(true)



}




// update the marked count
function updateMarkedCount(diff) {
    var elMarked = document.querySelector('.marked-counter')

    if (diff) {
        gGame.markedCount += diff
    } else {
        gGame.markedCount = 0
    }

    elMarked.innerText = `${gGame.markedCount} / ${gMines || 0}`
}


// update the shown count
function updateShownCount(diff) {

    if (diff) {
        gGame.shownCount += diff
    } else {
        gGame.shownCount = 0
    }

}




// update the lives count
function updateLives(diff) {
    if (diff) {
        gGame.lives -= diff
        gMines--
        updateMarkedCount(0)
    } else {
        gGame.lives = LIVES
    }
    if (gGame.lives >= 0) {
        renderLives()
    }

}






// update the lives count
function updateSafeClick(diff) {
    var elSafeClick = document.querySelector('.safeClick')

    if (diff) {
        gGame.safeClick -= diff
    } else {
        gGame.safeClick = SAFE_CLICK
    }
    if (gGame.safeClick >= 0) {
        elSafeClick.innerText = gGame.safeClick

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
    gEmptyCells = getEmptyCells(gBoard)
    return (gEmptyCells.length === 0 && gGame.markedCount === gMines || gEmptyCells.length === 0 && gGame.lives >= 0 && gGame.markedCount === gMines)
    // gEmptyCells.length === 0 && gGame.lives >= 0)
}




// tell us if we won or lost
function isGameWon(isWin) {
    stopGameTimer()
    if (isWin) {
        updateSmiley('😎')
        switch (gLevel.SIZE) {
            case 4:
                console.log('4');
                setBestTime('beginner', gGame.secsPassed)
                break;
            case 8:
                console.log('8');
                setBestTime('medium', gGame.secsPassed)
                break;
            case 12:
                console.log('12');
                setBestTime('expert', gGame.secsPassed)
                break;


        }

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
    return emptyCells
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






function startGameTimer() {
    gElapsedTime = 0
    const start = Date.now();
    console.log(`start:`, start)
    gTimerInterval = setInterval(() => {
        gElapsedTime = Date.now() - start;
        var timer = gElapsedTime / 1000
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = timer.toFixed(0)
        gGame.secsPassed = timer.toFixed(0)
    }, 1000);

}



function stopGameTimer() {
    clearInterval(gTimerInterval)
}

function restartTimer() {
    stopGameTimer()
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '0'
}



function onClickLevel(size, mines) {
    gLevel.MINES = mines
    gLevel.SIZE = size
    onInit()
}


