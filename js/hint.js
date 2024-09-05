'use strict'


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
