'use strict'

var gIsLightMode = false

function onChangeMode(elBtn) {
    var elGameContainer = document.querySelector('.game-container')
    var elTds = document.querySelectorAll('td')

    if (gIsLightMode) {
        elGameContainer.classList.remove('light-mode')
        for (var i = 0; i < elTds.length; i++) {
            elTds[i].classList.remove('light-mode')
        }
        elBtn.innerText = `Light Mode`
        gIsLightMode = false
    } else {
        elGameContainer.classList.add('light-mode')
        for (var i = 0; i < elTds.length; i++) {
            elTds[i].classList.add('light-mode')
        }
        elBtn.innerText = `Dark Mode`
        gIsLightMode = true
    }
}