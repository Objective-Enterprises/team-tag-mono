import Matter from 'matter-js'
import PolygonFeature from './PolygonFeature'
import Stage from './Stage'

export default class RectangleFeature extends PolygonFeature {
  readonly height: number
  readonly width: number
  readonly halfWidth: number
  readonly halfHeight: number
  readonly leftSide: number
  readonly rightSide: number
  readonly topSide: number
  readonly bottomSide: number
  constructor ({ blue = 128, density = 0.001, green = 128, height, red = 128, stage, width, x, y }: {
    blue?: number
    density?: number
    green?: number
    height: number
    red?: number
    stage: Stage
    width: number
    x: number
    y: number
  }) {
    const body = Matter.Bodies.rectangle(x, y, width, height)
    super({ blue, body, density, green, red, stage })
    this.width = width
    this.height = height
    this.halfWidth = this.width / 2
    this.halfHeight = this.height / 2
    this.leftSide = x - this.halfWidth
    this.rightSide = x + this.halfWidth
    this.topSide = y - this.halfHeight
    this.bottomSide = y + this.halfHeight
  }

  getArea (): number {
    return this.width * this.height
  }

  isIntersected ({ height, width, x, y }: {
    height: number
    width: number
    x: number
    y: number
  }): boolean {
    const leftSide = x - (width / 2)
    const rightSide = x + (width / 2)
    const toRight = leftSide >= this.rightSide
    const toLeft = rightSide <= this.leftSide
    const noHorizontal = toRight || toLeft
    if (noHorizontal) return false
    const topSide = y - (height / 2)
    const bottomSide = y + (height / 2)
    const toBottom = topSide >= this.bottomSide
    const toTop = bottomSide <= this.topSide
    const noVertical = toBottom || toTop
    if (noVertical) return false
    return true
  }
}
