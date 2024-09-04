'use strict'



//* Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location)
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}


//* Returns the class name for a specific cell
function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`
    return cellClass
}



// getting the cell value by postion
function getCellValue(cellI, cellJ, board) {
    const cell = board[cellI][cellJ]
    const mineNumber = cell.minesAround !== 0 ? cell.minesAround : EMPTY
    const value = cell.isMine ? MINE : mineNumber
    return value
}



// function that get the cell pos by class
function getCellByClass(classes) {
    var splittedClasses = classes[1].split('-')
    var cellPos = { i: splittedClasses[1], j: splittedClasses[2] }
    return cellPos
}






// Get random number
function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


// Get random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}