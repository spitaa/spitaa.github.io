import GameObject from "./engine.js"

export default class Bullet extends GameObject {

    constructor(shooter, enemy_bullet = false) {
        super('bullet')
        this.shooter = shooter
        this.speed = 500
        this.isEnemyBullet = enemy_bullet
        this.movement = {
            x: 0,
            y: (this.isEnemyBullet ? 1 : -1)
        }
        this.element.src = `assets/${(this.isEnemyBullet ? 'enemies/' : 'player/')}bullet.png`
        this.getDamage = false
        this.setup(() => {
            this.rect.x = this.shooter.rect.x + this.shooter.rect.width / 2 - this.rect.width / 2
            this.rect.y = (this.isEnemyBullet ?
                this.shooter.rect.bottom :
                this.shooter.rect.top - this.rect.height
            )
        })
    }

    /**
     * @param {number} deltaTime 
     */
    update(deltaTime) {
        super.update(deltaTime)
        if (this.rect.bottom <= 0 || this.rect.top >= window.innerHeight) {
            this.destroy()
        }

        GameObject.currentObjects.forEach((obj) => {
            if (!obj.getDamage || obj == this.shooter || obj.team == this.shooter.team)
                return
            if (this.overlaps(obj)) {
                obj.damage()
                this.destroy()
            }
        })
    }
}