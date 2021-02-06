export class Position {
  readonly x: number
  readonly y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  translate = (x: number, y: number): Position => new Position(this.x + x, this.y + y)
  toString = () => `${this.x},${this.y}`
}

export class SquareGrid {
  readonly size: number

  constructor(size: number) {
    this.size = size
  }

  contains(position: Position): boolean {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size 
  }
}

export enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W'
}

const directions = [Direction.N, Direction.E, Direction.S, Direction.W]

const tx = (direction: Direction) : number => direction == Direction.E ? 1 : direction == Direction.W ? -1 : 0
const ty = (direction: Direction) : number => direction == Direction.N ? 1 : direction == Direction.S ? -1 : 0

const right = (direction: Direction) : Direction => directions[(directions.indexOf(direction) + 1) % directions.length]
const left = (direction: Direction) : Direction => directions[(directions.indexOf(direction) + directions.length - 1) % directions.length]

export class Robot {
  readonly grid: SquareGrid
  readonly position: Position
  readonly direction: Direction

  constructor(grid: SquareGrid, position: Position, direction: Direction) {
    this.grid = grid
    this.position = position
    this.direction = direction
  }

  private futurePosition = () => this.position.translate(tx(this.direction), ty(this.direction))
  private canMove = () => this.grid.contains(this.futurePosition())
  
  move = () : Robot => this.canMove() ? new Robot(this.grid, this.futurePosition(), this.direction) : this
  rotateRight = () : Robot => new Robot(this.grid, this.position, right(this.direction))  
  rotateLeft = () : Robot => new Robot(this.grid, this.position, left(this.direction))
  toString = () => `${this.position} ${this.direction}`
}

export class StringyCommandHandler {
  private readonly handlers = {}

  register(name: string, numArgs: number, handler: Function) {
    this.handlers[name] = {numArgs, handler}
  }

  handle(stringyCommand: string) {
    const complainUnless = (info: string, assertion: Function) => {
      if (!assertion()) {
        throw new Error(`Bad command: ${info}`)
      }
    }

    const tokens = stringyCommand.split(' ')
    const meta = this.handlers[tokens[0]]
    if (meta) {
      if (meta.numArgs == 0) {
        complainUnless(`Expected 1 command token but got ${tokens.length}`, () => tokens.length == 1)
        return meta.handler()
      } else {
        complainUnless(`Expected 2 command tokens but got ${tokens.length}`, () => tokens.length == 2)
        const args = tokens[1].split(',')
        complainUnless(`Expected ${meta.numArgs} arg token(s) but got ${args.length}`, () => args.length == meta.numArgs)
        return meta.handler(...args)
      }
    } else {
      throw new Error(`Unknown command: ${stringyCommand}`)
    }
  }
}

export class StringyDriver {
  readonly grid = new SquareGrid(5);
  readonly log = []
  private readonly commandHandler = new StringyCommandHandler()
  private robot: Robot

  constructor() {
    this.commandHandler.register('REPORT', 0, () => this.log.push(this.status()))
    this.commandHandler.register('MOVE', 0, () => this.robot = this.robot?.move())
    this.commandHandler.register('LEFT', 0, () => this.robot = this.robot?.rotateLeft())
    this.commandHandler.register('RIGHT', 0, () => this.robot = this.robot?.rotateRight())
    this.commandHandler.register('PLACE', 3, (x: string, y: string, directionString: string) => {
      const safeParseInt = (s: string) : number => {
        const value = parseInt(s)
        if (isNaN(value)) {
          throw new Error(`${s} is not a number`)
        }
        return value
      }
      const position = new Position(safeParseInt(x), safeParseInt(y))
      if (this.grid.contains(position)) {
        const direction = directions.find((d) => d.toString() == directionString)
        if (!direction) {
          throw new Error(`${directionString} is not a direction`)
        }
        this.robot = new Robot(this.grid, position, direction)
      }
    })
  }

  perform(command: string){
    this.commandHandler.handle(command)
  } 

  status() : string {
    return this.robot ? [this.robot.position.x, this.robot.position.y, this.robot.direction].join(' ') : 'no robot'
  }
}