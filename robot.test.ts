import {Position, SquareGrid, Direction, Robot, StringyCommandHandler, StringyDriver} from './robot'

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
  const grid = new SquareGrid(3)
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
    const north = new Robot(grid, new Position(1, 1), Direction.N)
    test('rotateRight', () => {
      expect(north.rotateRight().direction).toEqual(Direction.E)
      expect(north.rotateRight().rotateRight().direction).toEqual(Direction.S)
      expect(north.rotateRight().rotateRight().rotateRight().direction).toEqual(Direction.W)
      expect(north.rotateRight().rotateRight().rotateRight().rotateRight().direction).toEqual(Direction.N)
    })
    test('rotateLeft', () => {
      expect(north.rotateLeft().direction).toEqual(Direction.W)
      expect(north.rotateLeft().rotateLeft().direction).toEqual(Direction.S)
      expect(north.rotateLeft().rotateLeft().rotateLeft().direction).toEqual(Direction.E)
      expect(north.rotateLeft().rotateLeft().rotateLeft().rotateLeft().direction).toEqual(Direction.N)
    })
  })
})

describe('StringyCommandHandler', () => {
  var subject: StringyCommandHandler
  beforeEach(() => {
    subject = new StringyCommandHandler()
    subject.register('foo', 0, () => 'called foo')
    subject.register('bar', 1, (arg1: string) => `called bar with ${arg1}`)
    subject.register('baz', 2, (arg1: string, arg2: string) => `called baz with ${arg1}, ${arg2}`)
  })
  describe('for commands with NO args', () => {
    test('no args passed - handles', () => {
      expect(subject.handle('foo')).toEqual('called foo')
    })
    test('args passed - complains', () => {
      expect(() => subject.handle('foo green')).toThrow('Bad command: Expected 1 command token but got 2')
    })
  }) 
  describe('for commands WITH args', () => {
    test('correct number of args passed - handles', () => {
      expect(subject.handle('bar red')).toEqual('called bar with red')
      expect(subject.handle('baz red,green')).toEqual('called baz with red, green')
    })
    test('incorrect number of args passed - complains', () => {
      expect(() => subject.handle('bar red,green')).toThrow('Bad command: Expected 1 arg token(s) but got 2')
      expect(() => subject.handle('baz red')).toThrow('Bad command: Expected 2 arg token(s) but got 1')
    })
    test('no args passed - complains', () => {
      expect(() => subject.handle('bar')).toThrow('Bad command: Expected 2 command tokens but got 1')
      expect(() => subject.handle('baz')).toThrow('Bad command: Expected 2 command tokens but got 1')
    })
  })
  describe('for unknown command', () => {
    test('complains', () => {
      expect(() => subject.handle('banana')).toThrow('Unknown command: banana')
    })
  })
})

describe('StringyDriver', () => {
  var subject: StringyDriver
  beforeEach(() => subject = new StringyDriver())
  test('has a hard-wired grid size so it does', () => {
    expect(subject.grid.size).toEqual(5)
  })
  describe('PLACE', () => {
    test('legit args - in bounds - places new robot', () => {
      subject.perform('PLACE 1,1,N')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['1 1 N'])
    })
    test('legit args - in bounds - existing robot - replaces', () => {
      subject.perform('PLACE 1,1,N')
      subject.perform('PLACE 2,2,S')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['2 2 S'])
    })
    test('legit args - NOT in bounds - does nothing', () => {
      subject.perform('PLACE 10,1,N')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['no robot'])
    })
    test('bad position args - complains vociferously', () => {
      expect(() => subject.perform('PLACE a,5,N')).toThrow('a is not a number')
      expect(() => subject.perform('PLACE 5,b,N')).toThrow('b is not a number')
    })
    test('bad direction arg - complains vociferously', () => {
      expect(() => subject.perform('PLACE 3,3,X')).toThrow('X is not a direction')
    })
    test('wrong number of args - complains vociferously', () => {
      ['PLACE', 'PLACE 1', 'PLACE 3,3,N,ETC'].forEach((bad) => {
        expect(() => subject.perform(bad)).toThrow(/Bad command/)
      })
    })
  }) 
  describe('MOVE', () => {
    test('can move - moves', () => {
      subject.perform('PLACE 1,1,N')
      subject.perform('MOVE')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['1 2 N'])
    })
    test('can NOT move - noes nothing', () => {
      subject.perform('PLACE 0,0,S')
      subject.perform('MOVE')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['0 0 S'])
    })
    test('no robot - noes nothing', () => {
      subject.perform('MOVE')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['no robot'])
    })
  }) 
  describe('LEFT', () => {
    test('has robot - rotates left', () => {
      subject.perform('PLACE 1,1,N')
      subject.perform('LEFT')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['1 1 W'])
    })
    test('no robot - noes nothing', () => {
      subject.perform('LEFT')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['no robot'])
    })
  }) 
  describe('RIGHT', () => {
    test('has robot - rotates left', () => {
      subject.perform('PLACE 1,1,N')
      subject.perform('RIGHT')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['1 1 E'])
    })
    test('no robot - noes nothing', () => {
      subject.perform('RIGHT')
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['no robot'])
    })
  }) 
  describe('REPORT', () => {
    test('no robot - reports no robt', () => {
      subject.perform('REPORT')
      
      expect(subject.log).toEqual(['no robot'])
    })
  }) 
  describe('unknown command', () => {
    test('complains vociferously', () => {
      expect(() => subject.perform('UNKNOWN')).toThrow(/Unknown command/)
    })
  }) 
  describe('non-PLACE command with args', () => {
    test('complains vociferously', () => {
      expect(() => subject.perform('MOVE 27')).toThrow(/Bad command/)
    })
  }) 
})
