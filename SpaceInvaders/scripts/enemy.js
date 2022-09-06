import GameObject from "./engine.js";
import Bullet from "./bullet.js";

export class Alien extends GameObject {

    static #color2 = false
    #fireInterval = null
    #spawnY = 0
    #nAlien = 0

    /**
     * @param {AlienGroup} group 
     * @param {number} firerate 
     */
    constructor(group, spawn_offset) {
        super('alien')
        this.group = group
        this.#spawnY = spawn_offset
        this.element.src = `assets/enemies/alien${(Alien.#color2 ? 2 : 1)}.png`
        Alien.#color2 = !Alien.#color2
        this.speed = this.group.speed
        this.movement = this.group.movement
        this.#nAlien = this.group.aliens.length
        this.team = 'enemy'
        this.setup(() => {
            this.rect.y = this.#spawnY
            this.rect.x = this.group.rect.x + ((this.group.rect.width / AlienGroup.N_ALIENS) * (this.#nAlien + 0.5)) - (this.rect.width / 2)

            this.#fireInterval = setInterval(() => {
                new Bullet(this, true)
            }, 750)
        })
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        this.speed = this.group.speed
        super.update(deltaTime)
    }

    destroy() {
        clearInterval(this.#fireInterval)
        this.#fireInterval = null
        this.group.aliens.splice(this.group.aliens.indexOf(this), 1)
        this.group.aliens.forEach((alien) => {
            alien.rect.x = alien.group.rect.x + ((alien.group.rect.width / AlienGroup.N_ALIENS) * (alien.#nAlien + 0.5)) - (alien.rect.width / 2)
        })
        this.group.speed *= 1.1

        super.destroy()
    }

}

export class AlienGroup extends GameObject {

    static #spawnY = -90
    static N_ALIENS = 7
    #isFromLeft = false

    /**
     * @param {number} speed 
     * @param {number} firerate 
     */
    constructor(speed, left_to_right = false) {
        super('alien-group', 'div')
        this.speed = speed
        this.#isFromLeft = left_to_right
        this.movement = {
            y: 0,
            x: (this.#isFromLeft ? 1 : -1)
        }
        this.getDamage = false
        this.setup(() => {
            AlienGroup.#spawnY += (window.innerHeight / 15) + 90
            this.rect.y = AlienGroup.#spawnY
            this.rect.x = (this.#isFromLeft ? 0 : window.innerWidth - this.rect.width)
            this.aliens = []
            for (let i = 0; i < AlienGroup.N_ALIENS; i++) {
                this.aliens.push(new Alien(this, AlienGroup.#spawnY))
            }
        })
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime)
        if ((this.rect.right - this.rect.width / 2.5) <= 0 || (this.rect.left + this.rect.width / 2.5) >= window.innerWidth) {
            this.movement.x *= -1
        }
    }

    destroy() {
        AlienGroup.#spawnY -= (window.innerHeight / 15) + 90
        super.destroy()
    }


}