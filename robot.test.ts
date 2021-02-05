import {Position} from './robot'

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
