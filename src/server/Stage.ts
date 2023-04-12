import csvAppend from 'csv-append'
import Matter from 'matter-js'
import Raycast from './Raycast'
import Actor from './Actor'
import Bot from './Bot'
import Brick from './Brick'
import Character from './Character'
import Feature from './Feature'
import Player from './Player'
import Wall from './Wall'
import Waypoint from './Waypoint'
import Line from '../shared/Line'
import Circle from '../shared/Circle'
import Controls from '../shared/controls'
import Label from '../shared/Label'
import Shape from '../shared/Shape'
import { UpdateMessage } from '../shared/socket'
import { VISION_INNER } from '../shared/VISION'
import { getRandomRectangleSize } from './math'

export default class Stage {
  stepActiveCollisionCount = 0
  actors = new Map<number, Actor>()
  bodies: Matter.Body[] = []
  bots: Bot[] = []
  centerBot: boolean
  characters = new Map<number, Character>()
  characterBodies: Matter.Body[] = []
  circles: Circle[] = []
  cornerBots: boolean
  countryBots: boolean
  countryWalls: boolean
  stepCollisionStartCount = 0
  debugBored: boolean
  debugCharacters: boolean
  debugChase: boolean
  debugOpenWaypoints: boolean
  debugCollision: boolean
  debugFeatures: boolean
  debugIsClear: boolean
  debugItChoice: boolean
  debugLost: boolean
  debugMakeIt: boolean
  debugNotItChoice: boolean
  debugPathing: boolean
  debugPlayerVision: boolean
  debugPosition: boolean
  debugSpeed: boolean
  debugStepTime: boolean
  debugExplore: boolean
  debugWaypointCircles: boolean
  debugWaypointLabels: boolean
  engine = Matter.Engine.create()
  features = new Map<number, Feature>()
  greekBots: boolean
  greekWalls: boolean
  gridBots: boolean
  initial = true
  halfSize: number
  labels: Label[] = []
  lines: Line[] = []
  lostPoints: Matter.Vector[] = []
  maximumArea: number
  midpointBots: boolean
  observer: boolean
  oldest?: Bot
  oldTime = Date.now()
  paused = false
  radii: number[] = []
  raycast: Raycast
  runner = Matter.Runner.create()
  sceneryFeatures: Feature[] = []
  sceneryBodies: Matter.Body[] = []
  size: number
  spawnOnDestroy: boolean
  spawnOnScore: boolean
  spawnOnTag: boolean
  spawnOnTimer: boolean
  stepCount = 0
  stepPursues = 0
  stepUnblocks = 0
  stepExplores = 0
  stepFlees = 0
  stepTimeLimit: number
  spawnTime: number
  timers = new Map<number, [number, () => void]>()
  totalBodyCount = 0
  totalCollisionCount = 0
  townBots: boolean
  townWalls: boolean
  wallBodies: Matter.Body[] = []
  wallBots: boolean
  walls: Wall[] = []
  warningCount = 0
  warningDifferenceTotal = 0
  warningTime = Date.now()
  readonly warnings10: number[] = []
  waypointBots: boolean
  waypointBricks: boolean
  waypointGroups: Record<number, Waypoint[]> = { }
  wildBricks: boolean
  wildPuppets: boolean
  xFactor = 2
  yFactor = 2
  constructor ({
    centerBot = true,
    cornerBots = false,
    countryWalls = true,
    countryBots = false,
    debugBored = false,
    debugCharacters = false,
    debugChase = false,
    debugOpenWaypoints = false,
    debugCollision = false,
    debugExplore = false,
    debugFeatures = false,
    debugIsClear = false,
    debugItChoice = false,
    debugLost = false,
    debugMakeIt = false,
    debugNotItChoice = false,
    debugPathing = false,
    debugPlayerVision = false,
    debugPosition = false,
    debugSpeed = false,
    debugStepTime = true,
    debugWaypointCircles = false,
    debugWaypointLabels = false,
    greekWalls = true,
    greekBots = false,
    gridBots = false,
    midpointBots = false,
    observer = false,
    spawnOnDestroy = true,
    spawnOnScore = false,
    spawnOnTag = true,
    spawnOnTimer = true,
    size = 3000,
    stepTimeLimit = 35,
    townWalls = true,
    townBots = false,
    wallBots = false,
    waypointBots = false,
    waypointBricks = false,
    wildBricks = true,
    wildPuppets = true
  }: {
    centerBot?: boolean
    cornerBots?: boolean
    countryBots?: boolean
    countryWalls?: boolean
    debugBored?: boolean
    debugCharacters?: boolean
    debugChase?: boolean
    debugOpenWaypoints?: boolean
    debugCollision?: boolean
    debugExplore?: boolean
    debugFeatures?: boolean
    debugIsClear?: boolean
    debugItChoice?: boolean
    debugLost?: boolean
    debugMakeIt?: boolean
    debugNotItChoice?: boolean
    debugPathing?: boolean
    debugPosition?: boolean
    debugPlayerVision?: boolean
    debugSpeed?: boolean
    debugStepTime?: boolean
    debugWaypointCircles?: boolean
    debugWaypointLabels?: boolean
    greekWalls?: boolean
    greekBots?: boolean
    gridBots?: boolean
    midpointBots?: boolean
    observer?: boolean
    spawnOnDestroy?: boolean
    spawnOnScore?: boolean
    spawnOnTag?: boolean
    spawnOnTimer?: boolean
    size?: number
    stepTimeLimit?: number
    townWalls?: boolean
    townBots?: boolean
    wallBots?: boolean
    waypointBots?: boolean
    waypointBricks?: boolean
    wildBricks?: boolean
    wildPuppets?: boolean
  }) {
    this.centerBot = centerBot
    this.cornerBots = cornerBots
    this.countryBots = countryBots
    this.countryWalls = countryWalls
    this.debugBored = debugBored
    this.debugCharacters = debugCharacters
    this.debugChase = debugChase
    this.debugOpenWaypoints = debugOpenWaypoints
    this.debugCollision = debugCollision
    this.debugFeatures = debugFeatures
    this.debugIsClear = debugIsClear
    this.debugItChoice = debugItChoice
    this.debugLost = debugLost
    this.debugMakeIt = debugMakeIt
    this.debugNotItChoice = debugNotItChoice
    this.debugPathing = debugPathing
    this.debugPlayerVision = debugPlayerVision
    this.debugPosition = debugPosition
    this.debugSpeed = debugSpeed
    this.debugStepTime = debugStepTime
    this.debugExplore = debugExplore
    this.debugWaypointCircles = debugWaypointCircles
    this.debugWaypointLabels = debugWaypointLabels
    this.greekBots = greekBots
    this.greekWalls = greekWalls
    this.gridBots = gridBots
    this.midpointBots = midpointBots
    this.observer = observer
    this.size = size
    this.spawnOnDestroy = spawnOnDestroy
    this.spawnOnScore = spawnOnScore
    this.spawnOnTag = spawnOnTag
    this.spawnOnTimer = spawnOnTimer
    this.stepTimeLimit = stepTimeLimit
    this.townBots = townBots
    this.townWalls = townWalls
    this.wallBots = wallBots
    this.waypointBots = waypointBots
    this.waypointBricks = waypointBricks
    this.wildBricks = wildBricks
    this.wildPuppets = wildPuppets
    this.spawnTime = Date.now()
    this.engine.gravity = { x: 0, y: 0, scale: 1 }
    this.raycast = new Raycast({ stage: this })
    for (let radius = Character.MINIMUM_RADIUS; radius <= Character.MAXIMUM_RADIUS; radius++) {
      this.radii.push(radius)
    }
    this.radii.forEach(radius => { this.waypointGroups[radius] = [] })
    const wallSize = this.size * 3
    const wallProps = [
      { x: 0, y: this.size, width: wallSize, height: this.size },
      { x: 0, y: -this.size, width: wallSize, height: this.size },
      { x: this.size, y: 0, width: this.size, height: wallSize },
      { x: -this.size, y: 0, width: this.size, height: wallSize }
    ]
    wallProps.forEach((props) => {
      void new Wall({ ...props, waypoints: false, stage: this })
    })
    this.halfSize = this.size / 2
    this.maximumArea = this.size * this.size
  }

  block (): void {}

  circle ({ color = 'white', radius, x, y }: {
    color?: string
    radius: number
    x: number
    y: number
  }): void {
    const circle = new Circle({ color, radius, x, y })
    this.circles.push(circle)
  }

  collide ({ delta, pair }: {
    delta?: number
    pair: Matter.IPair
  }): void {
    const actorA = this.actors.get(pair.bodyA.id)
    const actorB = this.actors.get(pair.bodyB.id)
    // @ts-expect-error
    const { normal } = pair.collision
    actorA?.collide({ actor: actorB, body: pair.bodyB, delta, normal })
    actorB?.collide({ actor: actorA, body: pair.bodyA, delta, normal })
  }

  control ({ controls, id }: {
    controls: Controls
    id: string
  }): void {
    const player = Player.players.get(id)
    if (player == null) {
      throw new Error('Player not found')
    }
    player.controls = controls
    if (player.controls.select) {
      this.paused = false
      this.runner.enabled = !this.paused
    }
  }

  debug ({ label }: { label?: string | number }): void {
    console.debug('CLIENT DEBUG:', label)
    console.debug(label, 'bots length:', this.bots.length)
  }

  getAllIts (): Character[] {
    const its: Character[] = []
    const characters = this.characters.values()
    for (const character of characters) {
      const it = character.isIt()
      if (it) its.push(character)
    }
    return its
  }

  getFirstIt (): Character | undefined {
    const characters = this.characters.values()
    for (const character of characters) {
      if (character.isIt()) return character
    }
  }

  getSafestWaypoint (props?: {
    its?: boolean
  }): Waypoint {
    const characters = props?.its === true ? this.getAllIts() : [...this.characters.values()]
    const waypoints = this.waypointGroups[Character.DEFAULT_RADIUS]
    const farthest = waypoints.reduce<{ waypoint?: Waypoint, distance: number }>((farthest, waypoint) => {
      const distance = characters.reduce((distance, it) => {
        const d = Matter.Vector.magnitude(Matter.Vector.sub(it.feature.body.position, waypoint.position))
        return d < distance ? d : distance
      }, Infinity)
      return distance > farthest.distance ? { waypoint, distance } : farthest
    }, { distance: 0 })
    if (farthest.waypoint == null) {
      throw new Error('No farthest waypoint')
    }
    return farthest.waypoint
  }

  getSpawnLimit (): number {
    return this.characters.size * 500
  }

  join (id: string): Player {
    const firstIt = this.getFirstIt()
    if (firstIt == null) {
      return new Player({
        id,
        observer: this.observer,
        x: 0,
        y: 0,
        stage: this,
        blue: Character.IT_COLOR.blue,
        green: Character.IT_COLOR.green,
        red: Character.IT_COLOR.red
      })
    }
    const position = firstIt?.getExploreHeading({})?.waypoint.position ?? { x: 0, y: 0 }
    return new Player({
      id,
      observer: this.observer,
      x: position.x,
      y: position.y,
      stage: this
    })
  }

  leave (id: string): void {
    const player = Player.players.get(id)
    if (player == null) return
    if (player?.isIt()) {
      const its = this.getAllIts()
      if (its.length === 1) {
        const notItBots = this.bots.filter(bot => !bot.isIt())
        notItBots[0]?.makeIt({ oldIt: player })
      }
    }
    player?.destroy()
  }

  label ({ color = 'white', text, x, y }: {
    color?: string
    text: string
    x: number
    y: number
  }): void {
    const label = new Label({ color, text, x, y })
    this.labels.push(label)
  }

  line ({ color = 'black', end, start }: {
    color: string
    end: Matter.Vector
    start: Matter.Vector
  }): void {
    const line = new Line({ color, end, start })
    this.lines.push(line)
  }

  randomBrick ({ x, y, width, height, minimumWidth = 1, minimumHeight = 1 }: {
    x: number
    y: number
    width: number
    height: number
    minimumWidth?: number
    minimumHeight?: number
  }): Brick {
    const rectangle = getRandomRectangleSize({
      minimumWidth: minimumWidth, maximumWidth: width, minimumHeight: minimumHeight, maximumHeight: height
    })

    return new Brick({
      x, y, width: rectangle.width, height: rectangle.height, stage: this
    })
  }

  spawnSafestBrick (): void {
    const waypoint = this.getSafestWaypoint()
    this.randomBrick({
      x: waypoint.position.x,
      y: waypoint.position.y,
      width: 30,
      height: 30
    })
  }

  start (): void {
    this.block()
    if (this.waypointBots || this.waypointBricks) {
      const waypointArrays = Object.values(this.waypointGroups)
      const waypoints = waypointArrays.reduce((waypoints, waypointArray) => [...waypoints, ...waypointArray], [])
      if (this.waypointBots) {
        waypoints.forEach(waypoint => {
          void new Bot({ x: waypoint.x, y: waypoint.y, stage: this })
        })
      }
      if (this.waypointBricks) {
        waypoints.forEach(waypoint => {
          this.randomBrick({ x: waypoint.x, y: waypoint.y, width: Bot.MAXIMUM_RADIUS * 2, height: Bot.MAXIMUM_RADIUS * 2 })
        })
      }
    }
    const marginEdge = this.halfSize - Character.MARGIN
    if (this.cornerBots) {
      void new Bot({ x: -marginEdge, y: -marginEdge, stage: this })
      void new Bot({ x: marginEdge, y: -marginEdge, stage: this })
      void new Bot({ x: -marginEdge, y: marginEdge, stage: this })
      void new Bot({ x: marginEdge, y: marginEdge, stage: this })
    }
    if (this.midpointBots) {
      void new Bot({ x: 0, y: -marginEdge, stage: this })
      void new Bot({ x: marginEdge, y: 0, stage: this })
      void new Bot({ x: 0, y: marginEdge, stage: this })
      void new Bot({ x: -marginEdge, y: 0, stage: this })
    }
    const innerSize = this.size - Character.MARGIN * 2
    this.xFactor = 2
    let xSegment = innerSize / this.xFactor
    while (xSegment > VISION_INNER.width) {
      this.xFactor = this.xFactor + 1
      xSegment = innerSize / this.xFactor
    }
    this.yFactor = 2
    let ySegment = innerSize / this.yFactor
    while (ySegment > VISION_INNER.height) {
      this.yFactor = this.yFactor + 1
      ySegment = innerSize / this.yFactor
    }
    const gridPoints: Matter.Vector[] = []
    for (let i = 0; i <= this.xFactor; i++) {
      for (let j = 0; j <= this.yFactor; j++) {
        const x = -innerSize / 2 + i * xSegment
        const y = -innerSize / 2 + j * ySegment
        gridPoints.push({ x, y })
        this.radii.forEach(radius => {
          void new Waypoint({ stage: this, x, y, radius })
        })
      }
    }
    if (this.gridBots) gridPoints.forEach(point => new Bot({ x: point.x, y: point.y, stage: this }))
    this.radii.forEach(radius => {
      console.info('Pathfinding for radius:', radius)
      const group = this.waypointGroups[radius]
      if (group.length === 0) {
        throw new Error(`No waypoints for radius ${radius}`)
      }
      group.forEach(waypoint => {
        waypoint.distances = group.map(() => Infinity)
      })
      console.info('Setting neighbors...')
      group.forEach(waypoint => {
        waypoint.setNeighbors()
        if (waypoint.neighbors.length === 0) {
          console.info('neighbors', waypoint.id, waypoint.neighbors.length)
          this.circle({ radius: 10, x: waypoint.x, y: waypoint.y, color: 'orange' })
        }
      })
      console.info('Updating distances...')
      group.forEach(() => group.forEach(waypoint => waypoint.updateDistances()))
      console.info('Setting paths...')
      group.forEach(waypoint => {
        waypoint.setPaths()
      })
    })
    console.info('Pathfinding complete!')
    Matter.Runner.run(this.runner, this.engine)
    const { append } = csvAppend('steps.csv')
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      this.stepCount = this.stepCount + 1
      this.raycast.rayCountTotal = this.raycast.rayCountTotal + this.raycast.stepRayCount
      this.totalCollisionCount = this.totalCollisionCount + this.stepCollisionStartCount // + this.activeCollisions
      const bodies = Matter.Composite.allBodies(this.engine.world)
      this.totalBodyCount = this.totalBodyCount + bodies.length
      this.timers.forEach((value, index) => {
        const endTime = value[0]
        const action = value[1]
        if (this.engine.timing.timestamp > endTime) {
          action()
        }
      })
      Array.from(this.timers.entries()).forEach(([key, value]) => {
        const endTime = value[0]
        if (this.engine.timing.timestamp > endTime) {
          this.timers.delete(key)
        }
      })
      const newTime = Date.now()
      const difference = newTime - this.oldTime
      if (this.debugStepTime) {
        if (this.initial) {
          console.debug('initial difference:', difference)
          this.initial = false
        }

        if (difference >= this.stepTimeLimit) {
          this.warningCount = this.warningCount + 1
          const warningDifference = newTime - this.warningTime
          this.warningDifferenceTotal = this.warningDifferenceTotal + warningDifference
          const average = Math.floor(this.warningDifferenceTotal / this.warningCount)
          this.warnings10.unshift(warningDifference)
          if (this.warnings10.length > 10) {
            this.warnings10.pop()
          }
          const average10 = Math.floor(this.warnings10.reduce((a, b) => a + b, 0) / this.warnings10.length)
          const stepCollisions = this.stepCollisionStartCount + this.stepActiveCollisionCount
          const averageCollisions = Math.floor(this.totalCollisionCount / this.stepCount)
          const averageBodies = Math.floor(this.totalBodyCount / this.stepCount)
          const averageRays = Math.floor(this.raycast.rayCountTotal / this.stepCount)
          console.warn(`Warning! ${this.warningCount}: ${difference}ms (∆${warningDifference}, μ${average}, 10μ${average10}) ${this.characters.size} characters
${stepCollisions} collisions (μ${averageCollisions}), ${bodies.length} bodies (μ${averageBodies}), ${this.raycast.stepRayCount} rays (μ${averageRays})`)
          this.warningTime = newTime
        }
        this.oldTime = newTime
      }
      this.runner.enabled = !this.paused
      if (!this.paused) {
        this.lines = []
        this.circles = []
        if (this.debugWaypointCircles) {
          this.waypointGroups[Character.DEFAULT_RADIUS].forEach(waypoint => {
            this.circle({
              color: 'darkblue',
              radius: 5,
              x: waypoint.x,
              y: waypoint.y
            })
          })
        }
      }
      this.actors.forEach(actor => actor.act())
      if (this.spawnOnTimer) {
        const now = Date.now()
        const spawnDifference = now - this.spawnTime
        const spawnLimit = this.getSpawnLimit()
        if (spawnDifference > spawnLimit) {
          const waypoint = this.getSafestWaypoint({ its: true })
          const allIts = this.getAllIts()
          const halfCharacters = this.characters.size / 2
          const safe = halfCharacters > allIts.length
          const color = safe ? Character.IT_COLOR : Character.NOT_IT_COLOR
          void new Bot({ x: waypoint.position.x, y: waypoint.position.y, stage: this, ...color })
          this.spawnTime = now
        }
      }
      const record = {
        warnings: this.warningCount,
        steps: this.stepCount,
        time: newTime,
        difference,
        activeCollisions: this.stepActiveCollisionCount,
        collisionStarts: this.stepCollisionStartCount,
        characters: this.characters.size,
        bodies: bodies.length,
        raycasts: this.raycast.stepRaycasts,
        clears: this.raycast.stepClears,
        unblocks: this.stepUnblocks,
        explores: this.stepExplores,
        flees: this.stepFlees,
        pursues: this.stepPursues
      }
      append(record)
      this.stepCollisionStartCount = 0
      this.stepActiveCollisionCount = 0
      this.stepPursues = 0
      this.stepExplores = 0
      this.stepFlees = 0
      this.stepUnblocks = 0
      this.raycast.stepRayCount = 0
      this.raycast.stepClears = 0
    })

    Matter.Events.on(this.engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        this.stepCollisionStartCount = this.stepCollisionStartCount + 1
        this.collide({ pair })
      })
    })

    Matter.Events.on(this.engine, 'collisionActive', event => {
      event.pairs.forEach(pair => {
        this.stepActiveCollisionCount = this.stepActiveCollisionCount + 1
        const delta = this.engine.timing.lastDelta
        this.collide({ delta, pair })
      })
    })
  }

  timeout (delay: number, action: () => void): void {
    const startTime = this.engine.timing.timestamp
    const endTime = startTime + delay
    this.timers.set(this.timers.size, [endTime, action])
  }

  update (id: string): UpdateMessage {
    const player = Player.players.get(id)
    if (player == null) {
      throw new Error('Player not found')
    }
    if (this.lostPoints.length > 100) {
      this.lostPoints = this.lostPoints.slice(-100)
    }
    if (this.debugLost) {
      this.lostPoints.forEach(point => {
        this.circle({
          color: 'yellow',
          radius: 5,
          x: point.x,
          y: point.y
        })
      })
    }
    const visibleFeatures = this.debugFeatures ? [...this.features.values()] : player.getVisibleFeatures()
    const shapes = visibleFeatures.map(feature => {
      const shape = new Shape({
        alpha: feature.alpha,
        blue: feature.blue,
        body: feature.body,
        green: feature.green,
        red: feature.red
      })
      if (shape.id === player.feature.body.id) {
        const color = player.isIt()
          ? 'hotpink'
          : 'limegreen'
        const newRender = { ...shape.render, strokeStyle: color }
        const newShape = { ...shape, render: newRender }
        return newShape
      }
      return shape
    })
    const message = {
      shapes,
      lines: this.lines,
      circles: this.circles,
      labels: this.labels,
      torsoId: player.feature.body.id
    }
    player.goals.forEach((goal) => {
      const circleColor = goal.scored ? 'rgba(255, 255, 255, 0.25)' : goal.heading.tight ? 'rgba(0, 128, 0, 0.25)' : 'rgba(0, 255, 0, 0.25)'
      const radius = goal.heading.tight ? 15 : 7.5
      const circle = new Circle({
        color: circleColor,
        radius,
        x: goal.heading.waypoint.position.x,
        y: goal.heading.waypoint.position.y
      })
      message.circles = [...message.circles, circle]
      const labelColor = goal.scored ? 'white' : 'limegreen'
      const text = goal.scored
        ? goal.number
        : goal.heading.tight
          ? player.score + 5
          : player.score + 1
      const label = new Label({
        color: labelColor,
        text: String(text),
        x: goal.heading.waypoint.position.x,
        y: goal.heading.waypoint.position.y
      })
      message.labels = [...message.labels, label]
    })
    const passes = player.goals.filter(goal => goal.passed)
    if (passes.length > 1) {
      throw new Error('More than one pass')
    }
    passes.forEach(pass => {
      const color = pass.scored ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 255, 0, 0.15)'
      const circle = new Circle({
        color,
        radius: 10,
        x: pass.heading.waypoint.position.x,
        y: pass.heading.waypoint.position.y
      })
      message.circles = [...message.circles, circle]
    })

    return message
  }
}
