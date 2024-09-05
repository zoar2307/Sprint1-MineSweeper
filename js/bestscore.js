'use strict'

function updateScore() {

    if (typeof (Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        // Store
        var bestBeginner = localStorage.getItem("bestBeginner");
        var bestMedium = localStorage.getItem("bestMedium");
        var bestExpert = localStorage.getItem("bestExpert");

        var elBeginner = document.querySelector('.beginner')
        var elMedium = document.querySelector('.medium')
        var elExpert = document.querySelector('.expert')

        elBeginner.innerText = bestBeginner || `None`
        elMedium.innerText = bestMedium || `None`
        elExpert.innerText = bestExpert || `None`


    } else {
        // Sorry! No Web Storage support..
    }
}



function setBestTime(diff, score) {
    var level
    if (diff === 'beginner') {
        level = 'bestBeginner'
    }
    if (diff === 'medium') {
        level = 'bestMedium'
    }
    if (diff === 'expert') {
        level = 'bestExpert'
    }
    console.log(`localStorage.getItem(`, localStorage.getItem(`${level}`))
    console.log(score);
    if (localStorage.getItem(`${level}`) === null || +localStorage.getItem(`${level}`) > +score) {
        localStorage[level] = score
    }

}