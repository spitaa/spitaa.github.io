import Ministage from "../ministage.js"
import GameObject from "./engine.js"
import Bullet from "./bullet.js"

export default class Player extends GameObject {

    static #MAX_LEVEL = 3
    #fireInterval = null
    #preventSpam = false
    #input = {
        x: 0,
        y: 0
    }

    constructor() {
        super('player')
        this.level = 1
        this.idleImage = `assets/player/level${this.level}/idle.png`
        this.activeImage = `assets/player/level${this.level}/active.png`
        this.element.src = this.idleImage
        this.speed = 300
        this.firerate = 2
        this.healthbar = document.getElementById('healthbar')
        this.#addHealth(2)
        this.maxHealth = 3
        this.gameover = false

        this.team = 'player'

        this.setup(() => {
            this.rect.x = (window.innerWidth - this.rect.width) / 2
            this.rect.y = window.innerHeight - this.rect.height - (window.innerHeight / 10)
        })
    }

    /**
     * @param {KeyboardEvent} e 
     * @param {Object<string, boolean>} pressedKeys 
     */
    onkeydown(e, pressedKeys) {
        // switch (e.key) {
        //     case 'ArrowRight':
        //         this.#input.x = 1
        //         break;
        //     case 'ArrowLeft':
        //         this.#input.x = -1
        //         break;
        //     case 'ArrowUp':
        //         this.#input.y = -1
        //         break;
        //     case 'ArrowDown':
        //         this.#input.y = 1
        //         break;
        //     case ' ':
        //         this.startShooting()
        //         break;
        // }
        let result = Ministage.elaboraInput(e.key)
        if (result == undefined) {
            this.#input.x = this.#input.y = this.movement.x = this.movement.y = 0
            pressedKeys[e.key] = false
            return
        }
        this.#input.x = (result.x == 0 ? this.#input.x : result.x)
        this.#input.y = (result.y == 0 ? this.#input.y : result.y)
        if (result.spara) {
            this.startShooting()
        }
        this.#calcMovement()
    }

    /**
     * @param {KeyboardEvent} e 
     * @param {Object<string, boolean>} pressedKeys 
     */
    onkeyup(e, pressedKeys) {
        switch (e.key) {
            case 'ArrowRight':
                this.#input.x = (pressedKeys['ArrowLeft'] ? -1 : 0)
                break;
            case 'ArrowLeft':
                this.#input.x = (pressedKeys['ArrowRight'] ? 1 : 0)
                break;
            case 'ArrowDown':
                this.#input.y = (pressedKeys['ArrowUp'] ? -1 : 0)
                break;
            case 'ArrowUp':
                this.#input.y = (pressedKeys['ArrowDown'] ? 1 : 0)
                break;
            case ' ':
                this.stopShooting()
                break;
        }
        if (this.#input.x == 0 && this.#input.y == 0) {
            this.movement = this.#input
            return
        }
        this.#calcMovement()
    }

    #calcMovement() {
        let magnitude = Math.sqrt(Math.pow(this.#input.x, 2) + Math.pow(this.#input.y, 2))
        if (magnitude != 0) {
            this.movement.x = this.#input.x / magnitude
            this.movement.y = this.#input.y / magnitude
        }
    }
    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        let resetx = this.rect.x,
            resety = this.rect.y
        super.update(deltaTime)

        if (this.rect.left <= 0 || this.rect.right >= window.innerWidth) {
            this.rect.x = resetx
        }

        if (this.rect.top <= 0 || this.rect.bottom >= window.innerHeight) {
            this.rect.y = resety
        }

        this.element.src = (this.movement.x != 0 || this.movement.y != 0 ? this.activeImage : this.idleImage)
    }

    startShooting() {
        if (this.#preventSpam || this.#fireInterval) {
            return
        }
        new Bullet(this, false)
        this.#preventSpam = true
        setTimeout(() => {
            this.#preventSpam = false
        }, 1000 / this.firerate)

        this.#fireInterval = setInterval(() => {
            new Bullet(this, false)
        }, 1000 / this.firerate)
    }

    stopShooting() {
        clearInterval(this.#fireInterval)
        this.#fireInterval = null
    }

    /**
     * @param {number} amount 
     */
    #addHealth(amount = 1) {
        var hearth
        for (let i = 0; i < amount; i++) {
            this.health++
            hearth = document.createElement('img')
            hearth.src = 'assets/hearth.png'
            this.healthbar.appendChild(hearth)
        }
    }


    /**
     * @param {number} total 
     */
    #refillHealth(total = this.maxHealth) {
        this.healthbar.innerHTML = ''
        this.health = total

        var hearth
        for (let i = 0; i < total; i++) {
            hearth = document.createElement('img')
            hearth.src = 'assets/hearth.png'
            this.healthbar.appendChild(hearth)
        }
    }

    /**
     * @param {number} amount 
     */
    damage(amount = 1) {
        super.damage(amount)
        for (let i = this.healthbar.childElementCount - 1; i > this.health - 1; i--) {
            this.healthbar.children[i].src = 'assets/lost_hearth.png'
        }
    }

    upgrade() {
        if (this.level >= Player.#MAX_LEVEL) {
            return
        }
        // this.speed += 100
        // this.firerate += 1
        // this.maxHealth++
        let result = Ministage.avanzaDiLivello({
            rateoDiFuoco: this.firerate,
            velocità: this.speed,
            vitaMassima: this.maxHealth
        })
        if (result == undefined) {
            return
        }

        this.speed = result.velocità
        this.firerate = result.rateoDiFuoco
        this.maxHealth = result.vitaMassima
        this.level++

        this.idleImage = `assets/player/level${this.level}/idle.png`
        this.activeImage = `assets/player/level${this.level}/active.png`
        if (this.#fireInterval !== null) {
            clearInterval(this.#fireInterval)
            this.#fireInterval = setInterval(() => {
                new Bullet(this, false)
            }, 1000 / this.firerate)
        }
        this.#refillHealth()
    }

    destroy() {
        clearInterval(this.#fireInterval)
        this.#fireInterval = null
        this.gameover = true
        super.destroy()
    }
}