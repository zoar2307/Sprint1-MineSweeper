'use strict'

const MINE = '💣'
const FLAG = '🚨'
const EMPTY = ''
const LIVES = 2
const HINTS = 3

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
    lives: 0,
    hints: HINTS
}

var gEmptyCells




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

    // disable the contextmenu and detect right click
    const elGameContainer = document.querySelector('.game-container')
    elGameContainer.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        onCellMarked(e.srcElement)
    });

    // Start the game
    gGame.isOn = true
}




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




// function that run on the empty cells and place in random cell Mine
function placeMineOnBoard(board) {
    var randomIdx = getRandomInt(0, gEmptyCells.length)
    var cell = gEmptyCells[randomIdx]

    gEmptyCells.splice(randomIdx, 1)
    // Modal
    board[cell.i][cell.j].isMine = true
}




// function that render the board we made to the dom
function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
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

        // check if its mine
        if (value === MINE) {

            // disbale the mine and counting the mine around
            cell.isMine = false
            cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)

            // get empty cells to put mine in empty cell
            getEmptyCells(gBoard)
            placeMineOnBoard(gBoard)

        }
        // Modal
        cell.isShown = true
        updateShownCount(1)

        // DOM
        renderCell(location, getCellValue(cellI, cellJ, gBoard))
        elCell.classList.add('showed')

        getEmptyCells(gBoard)
        return
    }

    cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)
    value = getCellValue(cellI, cellJ, gBoard)


    // if the cell is already opened return do nothing 
    if (cell.isShown) return

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
        var neighbors = getCellNegsList(cellI, cellJ, gBoard)
        console.log(neighbors);

        showNeig(neighbors)
    }




    // Modal
    cell.isShown = true
    updateShownCount(1)



    // DOM
    cell.minesAround = setMinesNegsCount(cellI, cellJ, gBoard)
    renderCell(location, value)
    elCell.classList.add('showed')


    getEmptyCells(gBoard)
    if (checkGameOver()) isGameWon(true)


    // console.log(`Debug cell is Showen \n:`, cell)

}

function onCellMarked(elCell) {
    // If game is off it return
    if (!gGame.isOn) return

    console.log(elCell);

    var cellPos = getCellByClass(elCell.classList)
    var cell = gBoard[cellPos.i][cellPos.j]
    if (cell.isShown) return


    // Modal
    cell.isMarked = !cell.isMarked
    var diff = cell.isMarked ? 1 : -1

    updateMarkedCount(diff)

    // Dom
    var value = cell.isMarked ? FLAG : EMPTY
    renderCell(cellPos, value)

    if (checkGameOver()) isGameWon(true)



}

function getCellByClass(classes) {
    var splitedClasses = classes[1].split('-')
    console.log(splitedClasses);
    var cellPos = { i: splitedClasses[1], j: splitedClasses[2] }
    return cellPos
}

function showNeig(neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i]
        console.log(neighbor);
        var value = getCellValue(neighbor.i, neighbor.j, gBoard)

        var cell = gBoard[neighbor.i][neighbor.j]
        // console.log(`cell:`, cell)

        // Modal
        cell.isShown = true
        updateShownCount(1)


        // Dom
        var location = { i: neighbor.i, j: neighbor.j }
        console.log(location);
        renderCell(location, value)

        var elCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
        elCell.classList.add('showed')
    }
}

function getCellValue(cellI, cellJ, board) {
    const cell = board[cellI][cellJ]
    const mineNumber = cell.minesAround !== 0 ? cell.minesAround : EMPTY
    const value = cell.isMine ? MINE : mineNumber
    return value
}



function updateMarkedCount(diff) {
    // var elLives = document.querySelector('.lives')

    if (diff) {
        gGame.markedCount += diff
    } else {
        gGame.markedCount = 0
    }

    // elLives.innerText = gGame.lives
}

function updateShownCount(diff) {
    // var elLives = document.querySelector('.lives')

    if (diff) {
        gGame.shownCount += diff
    } else {
        gGame.shownCount = 0
    }

    // elLives.innerText = gGame.lives
}

function updateLives(diff) {
    var elLives = document.querySelector('.lives')

    if (diff) {
        gGame.lives -= diff
    } else {
        gGame.lives = LIVES
    }
    if (gGame.lives >= 0) {
        elLives.innerText = gGame.lives
    }

}

function checkGameOver() {
    getEmptyCells(gBoard)
    return (gEmptyCells.length === 0 && gGame.markedCount === gLevel.MINES ||
        gEmptyCells.length === 0 && gGame.lives === 0)
}

function isGameWon(isWin) {

    if (isWin) {
        updateSmiley('😎')
    }
    if (!isWin) {
        updateSmiley('☠️')
        showAllMines()
    }

    gGame.isOn = false

}

function updateSmiley(smiley) {
    var elRestartSmiley = document.querySelector('.smiley')
    elRestartSmiley.innerText = smiley

}


function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine === true) neighborsCount++
        }
    }
    // console.log(`Debug neighborsCount cell :\n i : ${i} j : ${j} count : ${neighborsCount}`);
    return neighborsCount
}

function getCellNegsList(cellI, cellJ, board) {
    var neighborsList = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine !== true) neighborsList.push({ i, j })
        }
    }
    return neighborsList
}

function getEmptyCells(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine !== true && board[i][j].isShown !== true) emptyCells.push({ i, j })
        }
    }
    gEmptyCells = emptyCells
}

function findAllMines(board) {
    var mineCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine === true && board[i][j].isShown !== true) mineCells.push({ i, j })
        }
    }
    return mineCells
}

function showAllMines() {
    var mineCells = findAllMines(gBoard)
    for (var i = 0; i < mineCells.length; i++) {
        var mine = mineCells[i]
        renderCell(mine, MINE)
        var elCell = document.querySelector(`.cell-${mine.i}-${mine.j}`)
        elCell.classList.add('boom')
    }
}