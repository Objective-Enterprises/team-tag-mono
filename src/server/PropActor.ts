import Matter from 'matter-js'
import Feature from './Feature'
import Stage from './Stage'
import Actor from './Actor'
import { project } from './math'
import Bot from './Bot'
import Character from './Character'

export default class PropActor extends Actor {
  static BLUE = 255
  static DENSITY = 0.00003
  static GREEN = 255
  static RED = 0
  static COLOR = { blue: PropActor.BLUE, green: PropActor.GREEN, red: PropActor.RED }
  static LIMIT_COLOR = { blue: 0, green: 0, red: 0 }

  health: number
  readonly maximumHealth: number
  spawning = true
  spawnBodies = new Array<Matter.Body>()
  constructor ({ feature, stage }: {
    feature: Feature
    stage: Stage
  }) {
    super({ feature, stage })
    const area = this.feature.getArea()
    this.health = area
    this.maximumHealth = this.health
    setTimeout(() => {
      this.spawning = false
    }, 5000)
    this.spawnBodies = this
      .stage
      .bodies
      // @ts-expect-error
      .filter(body => body.id !== this.feature.body.id && Matter.Collision.collides(this.feature.body, body))
  }

  act (): void {
    super.act()
    // @ts-expect-error
    this.spawnBodies = this.spawnBodies.filter(body => Matter.Collision.collides(this.feature.body, body))
    this.spawnBodies.forEach(() => {
      const damage = this.maximumHealth / 1000
      this.takeDamage({ damage })
    })
  }

  getScale ({ label }: { label: string}): number {
    switch (label) {
      case 'wall':
        return 0.01
      case 'character':
        return 100
      default:
        return 1
    }
  }

  collide ({ actor, body, delta, normal }: {
    actor?: Actor
    body: Matter.Body
    delta?: number
    normal: Matter.Vector
    scale?: number
  }): void {
    super.collide({ actor, body, delta, normal })
    if (!this.spawning) {
      const massA = this.feature.body.mass
      const velocityA = this.feature.body.velocity
      const massB = body.mass < 100 ? body.mass : 100
      const velocityB = body.velocity
      const projectionA = project(velocityA, normal)
      const projectionB = project(velocityB, normal)
      const collideMomentum = Matter.Vector.sub(projectionA, projectionB)
      const collideForce = Matter.Vector.magnitude(collideMomentum)
      const collidePower = collideForce * massB / (massA + massB)
      const scale = this.getScale({ label: body.label })
      const impact = collidePower * scale
      const damage = Math.max(impact, 0.01)
      this.takeDamage({ damage, actor })
    }
  }

  takeDamage ({ damage, actor }: {
    damage: number
    actor?: Actor
  }): void {
    this.health = this.health - damage
    if (this.health <= 0) {
      if (actor?.isIt() === true) {
        if (this.stage.spawnOnDestroy) {
          void new Bot({ stage: this.stage, x: this.feature.body.position.x, y: this.feature.body.position.y })
        }
      } else if (actor?.feature.body.label === 'character') {
        const area = this.feature.getArea()
        const root = Math.sqrt(area)
        const shrink = root * 0.001
        const groundedShrink = Math.max(0.001, shrink)
        const scale = 1 - groundedShrink
        const floored = Math.max(scale, 0.5)
        Matter.Body.scale(actor.feature.body, floored, floored)
        const radius = actor.feature.getRadius()
        if (radius < 10) {
          const needed = 10 / radius
          actor.feature.setColor(PropActor.COLOR)
          Matter.Body.scale(actor.feature.body, needed, needed)
          void new Bot({ stage: this.stage, x: this.feature.body.position.x, y: this.feature.body.position.y })
        } else {
          const radiusDifference = Character.MAXIMUM_RADIUS - radius
          const radiusRatio = radiusDifference / 5
          const greenGrowth = (radiusRatio * Character.NOT_IT_COLOR.green)
          const green = Character.NOT_IT_COLOR.green + greenGrowth
          const greenRound = Math.ceil(green)
          const blue = radiusRatio * PropActor.BLUE
          const blueRound = Math.ceil(blue)
          if (actor.isPlayer) {
            console.log('--------PROP COLOR--------')
            console.log('radiusRatio', radiusRatio)
            console.log('greenRound', greenRound)
            console.log('blueRound', blueRound)
          }
          actor.feature.setColor({ green: greenRound, blue: blueRound, red: 0 })
        }
        // const delay = (1 - floored) * 10000
        // setTimeout(() => {
        //   if (!actor.isIt()) {
        //     actor.beReady()
        //   }
        // }, delay)
      }
      this.destroy()
    } else {
      const alpha = this.health / this.maximumHealth
      this.feature.setColor({ alpha })
    }
  }
}
