import {Position, SquareGrid, Direction, Robot} from './robot'

describe('Position', () => {
  describe('translate', () => {
    test('does simple arithmetic', () => {
      const position = new Position(3,3)

      expect(position.translate(0, 0).toString()).toEqual('3,3')
      expect(position.translate(1, 1).toString()).toEqual('4,4')
      expect(position.translate(2, 3).toString()).toEqual('5,6')
      expect(position.translate(-100, -300).toString()).toEqual('-97,-297')
    })
  })
})

describe('SquareGrid', () => {
  describe('contains', () => {
    test('does what it says on the tin', () => {
      expect(new SquareGrid(5).contains(new Position(0, 0))).toEqual(true)
      expect(new SquareGrid(5).contains(new Position(2, 3))).toEqual(true)
      expect(new SquareGrid(5).contains(new Position(4, 4))).toEqual(true)

      expect(new SquareGrid(5).contains(new Position(-1, 0))).toEqual(false)
      expect(new SquareGrid(5).contains(new Position(0, -1))).toEqual(false)
      expect(new SquareGrid(5).contains(new Position(4, 5))).toEqual(false)
      expect(new SquareGrid(5).contains(new Position(5, 4))).toEqual(false)

      expect(new SquareGrid(10).contains(new Position(9, 9))).toEqual(true)
      expect(new SquareGrid(10).contains(new Position(9, 10))).toEqual(false)
    })
  })
})

describe('Robot', () => {
  const grid = new SquareGrid(3);
  describe('move', () => {
    test('when the robot CAN move - moves', () => {
      expect(new Robot(grid, new Position(1, 1), Direction.N).move().toString()).toEqual('1,2 N')
      expect(new Robot(grid, new Position(1, 1), Direction.E).move().toString()).toEqual('2,1 E')
      expect(new Robot(grid, new Position(1, 1), Direction.S).move().toString()).toEqual('1,0 S')
      expect(new Robot(grid, new Position(1, 1), Direction.W).move().toString()).toEqual('0,1 W')
    })
    test('when the robot can NOT move - stays put', () => {
      expect(new Robot(grid, new Position(1, 2), Direction.N).move().toString()).toEqual('1,2 N')
      expect(new Robot(grid, new Position(2, 1), Direction.E).move().toString()).toEqual('2,1 E')
      expect(new Robot(grid, new Position(1, 0), Direction.S).move().toString()).toEqual('1,0 S')
      expect(new Robot(grid, new Position(0, 1), Direction.W).move().toString()).toEqual('0,1 W')
    })
  })
  describe('rotations', () => {
    const north = new Robot(grid, new Position(1, 1), Direction.N);
    test('rotateRight', () => {
      expect(north.rotateRight().direction).toEqual(Direction.E);
      expect(north.rotateRight().rotateRight().direction).toEqual(Direction.S);
      expect(north.rotateRight().rotateRight().rotateRight().direction).toEqual(Direction.W);
      expect(north.rotateRight().rotateRight().rotateRight().rotateRight().direction).toEqual(Direction.N);
    })
    test('rotateLeft', () => {
      expect(north.rotateLeft().direction).toEqual(Direction.W);
      expect(north.rotateLeft().rotateLeft().direction).toEqual(Direction.S);
      expect(north.rotateLeft().rotateLeft().rotateLeft().direction).toEqual(Direction.E);
      expect(north.rotateLeft().rotateLeft().rotateLeft().rotateLeft().direction).toEqual(Direction.N);
    })
  })
})

