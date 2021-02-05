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
