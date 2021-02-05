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
  readonly size: number;

  constructor(size: number) {
    this.size = size;
  }

  contains(position: Position): boolean {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size; 
  }
}

export enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W'
}

const directions = [Direction.N, Direction.E, Direction.S, Direction.W]

const tx = (direction: Direction) : number => direction == Direction.E ? 1 : direction == Direction.W ? -1 : 0;
const ty = (direction: Direction) : number => direction == Direction.N ? 1 : direction == Direction.S ? -1 : 0;

export class Robot {
  readonly grid: SquareGrid;
  readonly position: Position;
  readonly direction: Direction;

  constructor(grid: SquareGrid, position: Position, direction: Direction) {
    this.grid = grid;
    this.position = position;
    this.direction = direction;
  }

  private futurePosition = () => this.position.translate(tx(this.direction), ty(this.direction));
  private canMove = () => this.grid.contains(this.futurePosition());
  
  move = () : Robot => this.canMove() ? new Robot(this.grid, this.futurePosition(), this.direction) : this;
  toString = () => `${this.position} ${this.direction}`
}
