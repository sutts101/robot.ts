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