import {Position, SquareGrid} from './robot'

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
