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
    while (!this.isStuck()) {
      if (this.fails % 10000 === 0) {
        console.info(this.fails, 'consecutive procedural failures', this.getFill())
      }
      this.tryWall()
    }
    console.info('Final procedural fill:', this.getFill())
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

  isStuck (): boolean {
    const full = this.getFill() > 0.5
    if (full) {
      console.log('Procedural fill is full')
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
      return
    }
    const intersectingWall = this.walls.find(wall => wall.isIntersected(intersectionProps))
    if (intersectingWall != null) {
      this.fails += 1
      return
    }
    this.fails = 0
    const wall = new Wall({ height, stage: this, width, x, y })
    this.proceduralWalls.push(wall)
    console.info(this.proceduralWalls.length, 'producedural walls...')
  }
}
