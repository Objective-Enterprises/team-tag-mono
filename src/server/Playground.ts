import Stage from './Stage'

export default class Playground extends Stage {
  constructor () {
    super({
      townWalls: false,
      countryWalls: false,
      greekWalls: false,
      centerBot: true,
      spawnOnTimer: true,
      spawnOnDestroy: true,
      spawnOnScore: false,
      spawnOnTag: true,
      wildBricks: true,
      wildPuppets: false,
      debugFeatures: true,
      debugPlayerVision: true
    })
  }
}
