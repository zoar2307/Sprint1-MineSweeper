'use strict'

const MINE = '💣'
const FLAG = '🚨'
const EMPTY = ''

var gBoard

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 0,
}

var gEmptyCells

function onInit() {
    // Build the game Board 
    gBoard = buildBoard()

    // Render the game board to the dom
    renderBoard(gBoard)

    // Disable context menu on right click when you click on game-container
    const cells = document.querySelectorAll('.cell');
    for (var i = 0; i < cells.length; i++) {
        var elCell = cells[i]
        elCell.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            console.log('right');
            onCellMarked(e)
        });
    }

    // Restart core setup
    updateLives()
    updateShownCount()
    updateMarkedCount()
    gGame.secsPassed = 0
    updateSmiley('🤩')

    // Start the game
    gGame.isOn = true
}

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





    console.log(`Debug board:\n`, board)

    return board
}

function placeRandomMine(board) {
    var randomIdx = getRandomInt(0, gEmptyCells.length)
    var cell = gEmptyCells[randomIdx]

    // console.log(cell);

    gEmptyCells.splice(randomIdx, 1)
    board[cell.i][cell.j].isMine = true
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            cell.minesAround = setMinesNegsCount(i, j, board)
            const className = `cell cell-${i}-${j}`


            strHTML += `<td class="${className}" 
                            onclick="onCellClicked(this , ${i} , ${j} )"
                            contextmenu="onCellMarked(event)" 
                            >
                            ${EMPTY}
                        </td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, cellI, cellJ) {
    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        console.log(gGame.shownCount);
        gEmptyCells = getEmptyCells(gBoard)
        // for (var i = 0; i < gLevel.MINES; i++) {
        //     placeRandomMine(gBoard)
        // }


        gBoard[1][1].isMine = true
        gBoard[2][2].isMine = true
        renderBoard(gBoard)
    }
    const cell = gBoard[cellI][cellJ]
    var value = getCellValue(cellI, cellJ, gBoard)
    var location = { i: cellI, j: cellJ }

    if (cell.isShown) return

    if (value === MINE) {
        if (gGame.lives === 0) {
            isGameWon(false)
        }
        updateLives(1)
        // Modal
        cell.isShown = true

        // Dom
        renderCell(location, value)
        return
    }

    if (value === EMPTY) {
        console.log('EMPTY')

        var neighbors = getCellNeigList(cellI, cellJ, gBoard)
        console.log(neighbors);

        showNeig(neighbors)
    }




    // Modal
    cell.isShown = true
    updateShownCount(1)



    // DOM
    renderCell(location, value)

    gEmptyCells = getEmptyCells(gBoard)
    if (checkGameOver()) isGameWon(true)


    // console.log(`Debug cell is Showen \n:`, cell)

}

function onCellMarked(e) {
    if (!gGame.isOn) return
    var elCell = e.srcElement
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
        gGame.lives = 1
    }
    if (gGame.lives >= 0) {
        elLives.innerText = gGame.lives
    }

}

function checkGameOver() {
    gEmptyCells = getEmptyCells(gBoard)
    return (gEmptyCells.length === 0 && gGame.markedCount === gLevel.MINES ||
        gEmptyCells.length === 0 && gGame.lives === 0)
}

function isGameWon(isWin) {

    if (isWin) {
        updateSmiley('😎')
    }
    if (!isWin) {
        updateSmiley('☠️')
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

function getCellNeigList(cellI, cellJ, board) {
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
    // console.log(board);
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine !== true && board[i][j].isShown !== true) emptyCells.push({ i, j })
        }
    }
    // console.log(`emptyCells:`, emptyCells)
    return emptyCells
}