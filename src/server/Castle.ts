import { SOUTH_VECTOR, NORTH_VECTOR, WEST_VECTOR, EAST_VECTOR } from '../shared/math'
import Bot from './Bot'
import Brick from './Brick'
import Puppet from './Puppet'
import Stage from './Stage'
import Wall from './Wall'

export default class Castle extends Stage {
  block (): void {
    const townWalls: Wall[] = []
    if (this.townWalls) {
      const PIT = new Wall({ x: 605, y: -955, width: 1700, height: 1000, stage: this })
      const BYTE = new Wall({ x: -500, y: -1300, width: 5, height: 5, stage: this })
      const PALACE = new Wall({ x: -1000, y: -1150, width: 600, height: 310, stage: this })
      const BIT = new Wall({ x: -500, y: -1100, width: 1, height: 1, stage: this })
      const FORT = new Wall({ x: -872.5, y: -900, width: 1165, height: 100, stage: this })
      const MANSION = new Wall({ x: -520, y: -700, width: 460, height: 210, stage: this })
      const KNIFE = new Wall({ x: -1244.75, y: -659, width: 420.5, height: 2, stage: this })
      const SCALPEL = new Wall({ x: -1244.75, y: -612.5, width: 420.5, height: 1, stage: this })
      const OUTPOST = new Wall({ x: -1350, y: -517, width: 175, height: 100, stage: this })
      const ARMORY = new Wall({ x: -1125, y: -517, width: 175, height: 100, stage: this })
      const DAGGER = new Wall({ x: -988, y: -500, width: 3, height: 610, stage: this })
      const RAPIER = new Wall({ x: -941, y: -400, width: 1, height: 810, stage: this })
      const PRECINCT = new Wall({ x: -845, y: -500, width: 100, height: 610, stage: this })
      const BUTCHER = new Wall({ x: -700, y: -500, width: 100, height: 100, stage: this })
      const BAKER = new Wall({ x: -555, y: -500, width: 100, height: 100, stage: this })
      const CANDLESTICK = new Wall({ x: -375, y: -500, width: 170, height: 100, stage: this })
      const BAYONET = new Wall({ x: -1244.75, y: -419.5, width: 420.5, height: 5, stage: this })
      townWalls.push(PIT, BYTE, PALACE, BIT, FORT, MANSION, KNIFE, SCALPEL, OUTPOST, ARMORY, DAGGER, RAPIER, PRECINCT, BUTCHER, BAKER, CANDLESTICK, BAYONET)
    }

    const greekWalls: Wall[] = []
    if (this.greekWalls) {
      const alpha = new Wall({ x: -1454.5, y: -755, width: 1, height: 100, stage: this })
      const beta = new Wall({ x: -1408.5, y: -755, width: 1, height: 100, stage: this })
      const gamma = new Wall({ x: -1363, y: -755, width: 1, height: 100, stage: this })
      const delta = new Wall({ x: -1317.5, y: -755, width: 1, height: 100, stage: this })
      const epsilon = new Wall({ x: -1272, y: -755, width: 1, height: 100, stage: this })
      const zeta = new Wall({ x: -1226.5, y: -755, width: 1, height: 100, stage: this })
      const eta = new Wall({ x: -1181, y: -755, width: 1, height: 100, stage: this })
      const theta = new Wall({ x: -1135.5, y: -755, width: 1, height: 100, stage: this })
      const iota = new Wall({ x: -1090, y: -755, width: 1, height: 100, stage: this })
      const kappa = new Wall({ x: -1039.275, y: -801, width: 9.45, height: 8, stage: this })
      const lamda = new Wall({ x: -1039.275, y: -751.5, width: 9.45, height: 1, stage: this })
      const mu = new Wall({ x: -1039.275, y: -705.5, width: 9.45, height: 1, stage: this })
      greekWalls.push(alpha, beta, gamma, delta, epsilon, zeta, eta, theta, iota, kappa, lamda, mu)
      townWalls.concat(greekWalls)
    }

    const countryWalls: Wall[] = []
    if (this.countryWalls) {
      countryWalls.push(
        new Wall({ x: -1100, y: 400, width: 200, height: 500, stage: this }),
        new Wall({ x: 0, y: -200, width: 100, height: 100, stage: this }),
        new Wall({ x: 1000, y: 200, width: 200, height: 1000, stage: this }),
        new Wall({ x: -400, y: 600, width: 1000, height: 1000, stage: this }),
        new Wall({ x: 450, y: 700, width: 100, height: 800, stage: this }),
        new Wall({ x: -800, y: 1300, width: 400, height: 200, stage: this }),
        new Wall({ x: 300, y: 1300, width: 800, height: 200, stage: this }),
        new Wall({ x: -1250, y: 1300, width: 200, height: 50, stage: this })
      )
    }
    if (this.wildBricks) {
      void new Brick({ stage: this, x: -500, y: 0, width: 200, height: 500 })
      this.randomBrick({ x: -30, y: -30, height: 30, width: 30 })
      this.randomBrick({ x: -30, y: -30, height: 30, width: 30 })
      this.randomBrick({ x: 30, y: -30, height: 30, width: 30 })
      this.randomBrick({ x: 0, y: -30, height: 30, width: 30 })
      this.randomBrick({ x: 0, y: -30, height: 30, width: 100 })
      this.randomBrick({ x: 30, y: 0, height: 30, width: 50 })
      this.randomBrick({ x: -30, y: 0, height: 50, width: 30 })
      this.randomBrick({ x: -800, y: 0, height: 80, width: 30 })
      this.randomBrick({ x: -900, y: 0, height: 50, width: 50 })
      this.randomBrick({ x: -1000, y: 0, height: 50, width: 50 })
      this.randomBrick({ x: -1100, y: 0, height: 90, width: 80 })
      this.randomBrick({ x: -1200, y: 0, height: 50, width: 50 })
      this.randomBrick({ x: -1300, y: 0, height: 50, width: 50 })
      this.randomBrick({ x: -1400, y: 0, height: 50, width: 50 })
      this.randomBrick({ x: 0, y: 30, height: 30, width: 30 })
      this.randomBrick({ x: 30, y: 30, height: 30, width: 30 })
      this.randomBrick({ x: -30, y: 30, height: 30, width: 30 })
      this.randomBrick({ x: -500, y: 1400, height: 100, width: 200 })
      this.randomBrick({ x: -1300, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 750, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 800, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 850, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 900, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 950, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1000, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1050, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1100, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1150, y: 1300, height: 100, width: 30 })
      this.randomBrick({ x: 1200, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1250, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1300, y: 1300, height: 300, width: 30 })
      this.randomBrick({ x: 1350, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1400, y: 1300, height: 200, width: 30 })
      this.randomBrick({ x: 1450, y: 1300, height: 200, width: 30 })
    }
    if (this.wildPuppets) {
      const vertices = [
        { x: 100.75, y: 253.97279832749837 },
        { x: 100.75, y: -153.97279832749837 },
        { x: -100.75, y: 0 }
      ]
      void new Puppet({
        x: -1200,
        y: -1200,
        direction: SOUTH_VECTOR,
        stage: this,
        vertices
      })
      void new Puppet({
        x: 1350,
        y: -200,
        direction: NORTH_VECTOR,
        force: 0.0001,
        stage: this
      })
      void new Puppet({
        x: 1000,
        y: 0,
        force: 0.008,
        direction: WEST_VECTOR,
        stage: this
      })
      void new Puppet({
        x: -1700,
        y: 1700,
        direction: EAST_VECTOR,
        stage: this,
        vertices
      })
    }
    if (this.wallBots) {
      this.walls.forEach(wall => wall.spawnBots())
    }
    if (this.centerBot) void new Bot({ x: 100, y: 0, stage: this })
    if (this.greekBots) greekWalls.forEach(wall => wall.spawnBots())
    if (this.townBots) townWalls.forEach(wall => wall.spawnBots())
    if (this.countryBots) countryWalls.forEach(wall => wall.spawnBots())
    super.block()
  }
}
