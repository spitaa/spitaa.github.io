import { AlienGroup } from './scripts/enemy.js'
import GameObject from './scripts/engine.js'
import Ministage from './ministage.js'
import Player from './scripts/player.js'

const pressedKeys = {}
const levelLogger = document.getElementById('level')
const player = new Player()


window.onkeydown = (e) => {
    if (e.repeat) return
    pressedKeys[e.key] = true
    GameObject.currentObjects.forEach((obj) => {
        obj.onkeydown(e, pressedKeys)
    })
}

window.onkeyup = (e) => {
    pressedKeys[e.key] = false
    GameObject.currentObjects.forEach((obj) => {
        obj.onkeyup(e, pressedKeys)
    })
}

const alienGroupBaseSpeed = 300
const lastLevel = 3
var currentLevel = 1
var direction = !!Math.round(Math.random())

var alienGoups = [new AlienGroup(alienGroupBaseSpeed, !direction)]
var nextLevel = true

var lastRender = 0

/**
 * @param {number} timestamp animattion frame tiks between frames
 */
function loop(timestamp) {
    let deltaTime = (timestamp - lastRender) / 1000

    update(deltaTime)
    draw()

    if (player.gameover) {
        gameover()
    }

    for (let i = 0; i < alienGoups.length; i++) {
        const group = alienGoups[i];
        if (group.aliens.length > 0) {
            nextLevel = false
            break
        }
    }
    if (nextLevel) {
        currentLevel++
        let nGroups = alienGoups.length + 1
        alienGoups.forEach((group) => {
            group.destroy()
        })
        alienGoups = []

        if (currentLevel <= lastLevel) {
            for (let i = 0; i < nGroups; i++) {
                alienGoups.push(new AlienGroup(alienGroupBaseSpeed + (100 * i), direction))
                direction = !direction
            }
            player.upgrade()
            levelLogger.innerText = `LIVELLO ${currentLevel}/${lastLevel}`
        }
        else {
            win()
        }
    }

    nextLevel = true
    lastRender = timestamp
    window.requestAnimationFrame(loop)
}

function win() {
    levelLogger.innerText = 'Vittoria'
    levelLogger.style.color = 'lime'
    levelLogger.classList.add('center')
    win = () => { }
}

function gameover() {
    levelLogger.innerText = 'Game Over'
    levelLogger.style.color = 'red'
    levelLogger.classList.add('center')
    gameover = () => { }
}


/**
 * @param {number} deltaTime 
 */
function update(deltaTime) {
    for (let i = 0; i < GameObject.currentObjects.length; i++) {
        const gameobj = GameObject.currentObjects[i];
        gameobj.update(deltaTime)
    }
}


function draw() {
    for (let i = 0; i < GameObject.currentObjects.length; i++) {
        const gameobj = GameObject.currentObjects[i];
        gameobj.draw()
    }
}

levelLogger.innerText = `LIVELLO ${currentLevel}/${lastLevel}`
window.requestAnimationFrame(loop)