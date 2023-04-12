import Stage from './Stage'
import Wall from './Wall'
import Character from './Character'

export default class Procedural extends Stage {
  proceduralWalls: Wall[] = []
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
    console.log('block', this.getFill())
    while (this.getFill() < 0.5) {
      console.log('start fill', this.getFill())
      console.log('fails', this.fails)
      this.tryWall()
      console.log('end fill', this.getFill())
    }
    super.block()
  }

  getFill (): number {
    const wallArea = this.proceduralWalls.reduce((fill, wall) => fill + wall.getArea(), 0)
    return wallArea / this.maximumArea
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

  tryWall (): void {
    const x = this.getRandomCoordinate()
    const y = this.getRandomCoordinate()
    const width = this.getRandomSize()
    const height = this.getRandomSize()
    const intersectionWidth = width + this.doubleMargin
    const intersectionHeight = height + this.doubleMargin
    const intersectionProps = { x, y, width: intersectionWidth, height: intersectionHeight }
    const intersectingProceduralWall = this.proceduralWalls.find(wall => wall.isIntersected(intersectionProps))
    if (intersectingProceduralWall != null) {
      this.fails += 1
      console.log('procedural intersection', intersectingProceduralWall.body.position)
      return
    }
    const intersectingWall = this.walls.find(wall => wall.isIntersected(intersectionProps))
    if (intersectingWall != null) {
      this.fails += 1
      console.log('intersection', intersectingWall.body.position)
      return
    }
    this.fails = 0
    console.log('no intersection')
    console.log('x', x)
    console.log('y', y)
    console.log('width', width)
    console.log('height', height)
    const wall = new Wall({ height, stage: this, width, x, y })
    this.proceduralWalls.push(wall)
  }
}
