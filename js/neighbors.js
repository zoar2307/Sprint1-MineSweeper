'use strict'




// update the neig around count
function updateNeigAroundCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            currCell.minesAround = setMinesNegsCount(i, j, gBoard)
        }
    }
}



function expandShown(board, elCell, cellI, cellJ) {
    var steps = []
    var neighbors = getNonMineCellNegsList(cellI, cellJ, board)
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i]
        var cell = gBoard[neighbor.i][neighbor.j]
        var value = getCellValue(neighbor.i, neighbor.j, gBoard)

        if (cell.isShown) continue

        // Modal
        cell.isShown = true
        cell.isMarked = false
        updateShownCount(1)

        // Dom
        var location = { i: neighbor.i, j: neighbor.j }

        renderCell(location, value)

        var elCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
        elCell.classList.add('showed')

        steps.push(location)


    }
    for (var i = 0; i < steps.length; i++) {
        var currStepCell = steps[i]
        var value = getCellValue(currStepCell.i, currStepCell.j, gBoard)

        if (value !== EMPTY) continue
        console.log(currStepCell);
        var stepNeigs = getNonMineCellNegsList(currStepCell.i, currStepCell.j, board)
        console.log(stepNeigs);
        for (var j = 0; j < stepNeigs.length; j++) {
            var currStepNeig = stepNeigs[j]
            var cell = gBoard[currStepNeig.i][currStepNeig.j]
            value = getCellValue(currStepNeig.i, currStepNeig.j, gBoard)
            if (cell.isShown) continue


            // Modal
            cell.isShown = true
            cell.isMarked = false
            updateShownCount(1)

            // Dom
            var location = { i: currStepNeig.i, j: currStepNeig.j }

            renderCell(location, value)

            var elCell = document.querySelector(`.cell-${currStepNeig.i}-${currStepNeig.j}`)
            elCell.classList.add('showed')

            steps.push(location)
        }

    }


    recordStep(steps)
}





// function that show the neig around the empty cell
function showCells(cells, time) {
    for (var i = 0; i < cells.length; i++) {
        var currCellToShow = cells[i]
        var cell = gBoard[currCellToShow.i][currCellToShow.j]
        var value = getCellValue(currCellToShow.i, currCellToShow.j, gBoard)
        if (cell.isShown) continue

        // Dom
        var location = { i: currCellToShow.i, j: currCellToShow.j }
        console.log(location);
        renderCell(location, value)


        var elCell = document.querySelector(`.cell-${currCellToShow.i}-${currCellToShow.j}`)
        elCell.classList.add('hintshow')

        setTimeout(() => {
            hideCells(cells)

        }, time)
    }
}







function hideCells(cells) {
    for (var i = 0; i < cells.length; i++) {
        var currCellToHide = cells[i]
        var cell = gBoard[currCellToHide.i][currCellToHide.j]

        if (cell.isShown) continue
        // Dom
        var location = { i: currCellToHide.i, j: currCellToHide.j }
        console.log(location);
        renderCell(location, EMPTY)

        var elCell = document.querySelector(`.cell-${currCellToHide.i}-${currCellToHide.j}`)
        elCell.classList.remove('hintshow')
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var cell = board[i][j]
            cell.minesAround = countMineNeighbors(i, j, board)

        }
    }
}





// counting the mines around the cell
function countMineNeighbors(cellI, cellJ, board) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine === true) neighborsCount++
        }
    }
    return neighborsCount
}



// getting the neig list that they are not mines
function getNonMineCellNegsList(cellI, cellJ, board) {
    var neighborsList = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (board[i][j].isMine !== true && board[i][j].isShown !== true) neighborsList.push({ i, j })
        }
    }
    return neighborsList
}





// getting the neig list 
function getCellNegsList(cellI, cellJ, board) {
    var neighborsList = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            // if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            neighborsList.push({ i, j })
        }
    }
    console.log(neighborsList);
    return neighborsList
}


