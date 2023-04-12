import Waypoint from './Waypoint'

export interface Goal {
  number: number
  passed: boolean
  heading: Heading
  scored: boolean
}
export interface Heading {
  waypoint: Waypoint
  time: number
  distance: number
  tight: boolean
  explored: boolean
}
export interface Rectangle {
  x: number
  y: number
  width: number
  height: number
}
export interface MarginedRectangle extends Rectangle {
  margined: Rectangle
}
export interface PseudoActor {
  feature: {
    isIntersected: ({ height, width, x, y }: {
      height: number
      width: number
      x: number
      y: number
    }) => boolean
  }
}
