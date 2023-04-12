import Stage from './Stage'
import Wall from './Wall'
import Character from './Character'
import { MarginedRectangle, PseudoActor } from './types'
import Brick from './Brick'

export default class Procedural extends Stage {
  static FILL = 0.5
  proceduralWalls: Wall[] = []
  proceduralBricks: Brick[] = []
  doubleMargin: number
  fails = 0
  margin: number
  maximumCoordinate: number
  maximumEdge: number
  maximumSize: number
  minimumCoordinate: number
  minimumSize: number

  constructor () {
    console.log('procedural')
    super({})
    this.margin = Character.MAXIMUM_RADIUS * 3
    this.doubleMargin = this.margin * 2
    this.maximumEdge = this.halfSize - this.margin
    this.maximumSize = this.size - (this.margin * 2)
    this.minimumCoordinate = -this.halfSize + this.margin
    this.minimumSize = 1
    this.maximumCoordinate = this.maximumEdge - this.minimumSize
  }

  block (): void {
    while (!this.isStuck()) {
      if (this.fails % 10000 === 0) {
        console.info(this.fails, 'consecutive procedural failures', this.getFill())
      }
      try {
        const featureFactor = Math.random()
        if (featureFactor < 0.25) {
          this.guardWall()
        } else {
          this.guardBrick()
        }
      } catch (error) {
        this.fails = this.fails + 1
      }
    }
    console.info('Final procedural fill:', this.getFill())
    super.block()
  }

  getFill (): number {
    const wallArea = this.proceduralWalls.reduce((fill, wall) => fill + wall.getArea(), 0)
    const brickArea = this.proceduralBricks.reduce((fill, brick) => fill + brick.feature.getArea(), 0)
    const totalArea = wallArea + brickArea
    return totalArea / this.maximumArea
  }

  getRandomCoordinate (): number {
    const difference = this.maximumCoordinate - this.minimumCoordinate
    const factor = Math.random() * difference
    return factor + this.minimumCoordinate
  }

  getRandomSize (): number {
    const difference = this.maximumSize - this.minimumSize
    const factor = Math.random() * difference
    return factor + this.minimumSize
  }

  getRectangle (): MarginedRectangle {
    const x = this.getRandomCoordinate()
    const y = this.getRandomCoordinate()
    const width = this.getRandomSize()
    const height = this.getRandomSize()
    const marginedWidth = width + this.doubleMargin
    const marginWidth = height + this.doubleMargin
    const margined = {
      height: marginWidth,
      width: marginedWidth,
      x,
      y
    }
    const rectangle = {
      height,
      margined,
      width,
      x,
      y
    }
    return rectangle
  }

  guardBrick (): void {
    const rectangle = this.guardRectangle()
    const brick = new Brick({
      height: rectangle.height,
      stage: this,
      width: rectangle.width,
      x: rectangle.x,
      y: rectangle.y
    })
    this.proceduralBricks.push(brick)
    console.info(this.proceduralBricks.length, 'procedural bricks...')
  }

  guardIntersection ({ actors, rectangle }: {
    actors: PseudoActor[]
    rectangle: MarginedRectangle
  }): void {
    const intersecting = actors.find(actor => actor.feature.isIntersected(rectangle.margined))
    if (intersecting != null) {
      throw new Error('Intersecting')
    }
  }

  guardRectangle (): MarginedRectangle {
    const rectangle = this.getRectangle()
    this.guardIntersection({
      actors: this.proceduralWalls,
      rectangle
    })
    this.guardIntersection({
      actors: this.proceduralBricks,
      rectangle
    })
    this.guardIntersection({
      actors: this.walls,
      rectangle
    })
    this.fails = 0
    return rectangle
  }

  guardWall (): void {
    const rectangle = this.guardRectangle()
    const wall = new Wall({
      height: rectangle.height,
      stage: this,
      width: rectangle.width,
      x: rectangle.x,
      y: rectangle.y
    })
    this.proceduralWalls.push(wall)
    console.info(this.proceduralWalls.length, 'procedural walls...')
  }

  isStuck (): boolean {
    const full = this.getFill() > Procedural.FILL
    if (full) {
      console.log('Procedural full!')
      return true
    }

    if (this.proceduralWalls.length >= 100) {
      console.log('Too many procedural walls')
      return true
    }
    if (this.fails > 1000000) {
      console.warn('Too many procedural failures')
      return true
    }
    return false
  }
}
