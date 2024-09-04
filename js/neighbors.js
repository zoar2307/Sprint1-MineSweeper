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





// function that show the neig around the empty cell
function showNeig(neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i]
        var value = getCellValue(neighbor.i, neighbor.j, gBoard)
        var cell = gBoard[neighbor.i][neighbor.j]

        if (cell.isShown) continue

        if (!gIsHintOn) {
            // if the cell is already open so return

            // Modal
            cell.isShown = true
            updateShownCount(1)


            // Dom
            var location = { i: neighbor.i, j: neighbor.j }
            console.log(location);
            renderCell(location, value)

            var elCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
            elCell.classList.add('showed')

        } else {
            // Dom
            var location = { i: neighbor.i, j: neighbor.j }
            console.log(location);
            renderCell(location, value)


            var elCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
            elCell.classList.add('hintshow')

            setTimeout(() => {
                hideNeig(neighbors)

            }, 1000)
        }

    }
}





function hideNeig(neighbors) {
    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i]
        var cell = gBoard[neighbor.i][neighbor.j]

        if (cell.isShown) continue
        // Dom
        var location = { i: neighbor.i, j: neighbor.j }
        console.log(location);
        renderCell(location, EMPTY)

        var elCell = document.querySelector(`.cell-${neighbor.i}-${neighbor.j}`)
        elCell.classList.remove('hintshow')
    }
}





// counting the mines around the cell
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


