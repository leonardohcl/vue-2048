import Board from "./Board"

const preset = [0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]

describe('Board.js', () => {
    test('must create board correctly', () => {
        [3, 4, 5].forEach(size => {
            const board = new Board(size)
            expect(board.size).toBe(size)
            expect(board.squares.length).toBe(size * size)
        })
    })

    test('must create board with preset correctly', () => {
        const board = new Board(4, preset)
        preset.forEach((val, idx) => {
            expect(board.squares[idx].value).toBe(val)
        })
        expect(board.emptySquares.length).toBe(14)
        expect(board.filledSquares.length).toBe(2)
    })

    test('must load preset after creation correctly', () => {
        const board = new Board(4)
        expect(board.emptySquares.length).toBe(16)
        board.loadPreset(preset)
        preset.forEach((val, idx) => {
            expect(board.squares[idx].value).toBe(val)
        })
    })

    test('must get highest value correctly', () => {
        const board = new Board(4)
        expect(board.highestValue).toBe(0)
        const withPreset = new Board(4, preset)
        expect(withPreset.highestValue).toBe(4)
    })

    test('must get square correctly', () => {
        const board = new Board(4)
        const sqr = board.getSquare(1, 3)
        expect(sqr === board.squares[2]).toBe(false)
        expect(sqr === board.squares[7]).toBe(true)
    })

    test('must get square neighbor correctly', () => {
        const board = new Board(4)
        let neighbor

        // Valid neighbors
        neighbor = board.getSquareNeighbor(1, 1, 'up')
        expect(neighbor === board.squares[1]).toBe(true)
        neighbor = board.getSquareNeighbor(1, 1, 'right')
        expect(neighbor === board.squares[6]).toBe(true)
        neighbor = board.getSquareNeighbor(1, 1, 'down')
        expect(neighbor === board.squares[9]).toBe(true)
        neighbor = board.getSquareNeighbor(1, 1, 'left')
        expect(neighbor === board.squares[4]).toBe(true)

        // Edge neighbors (no-neighbor to that direction)
        neighbor = board.getSquareNeighbor(0, 0, 'up')
        expect(neighbor).toBe(undefined)
        neighbor = board.getSquareNeighbor(3, 3, 'right')
        expect(neighbor).toBe(undefined)
        neighbor = board.getSquareNeighbor(3, 3, 'down')
        expect(neighbor).toBe(undefined)
        neighbor = board.getSquareNeighbor(0, 0, 'left')
        expect(neighbor).toBe(undefined)
    })

    test('must get square valid movement correctly', () => {
        const board = new Board(4, [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2])

        // Free moves
        expect(board.getSquareValidMovement(3, 3, 'up')).toEqual([0, 3])
        expect(board.getSquareValidMovement(0, 0, 'right')).toEqual([0, 3])
        expect(board.getSquareValidMovement(0, 0, 'down')).toEqual([3, 0])
        expect(board.getSquareValidMovement(3, 3, 'left')).toEqual([3, 0])

        // Can't move
        expect(board.getSquareValidMovement(0, 0, 'up')).toEqual([null, null])
        expect(board.getSquareValidMovement(3, 3, 'right')).toEqual([null, null])
        expect(board.getSquareValidMovement(3, 3, 'down')).toEqual([null, null])
        expect(board.getSquareValidMovement(0, 0, 'left')).toEqual([null, null])

        // will merge
        board.loadPreset([
            0, 2, 0, 0,
            0, 0, 0, 0,
            0, 2, 0, 2,
            0, 0, 0, 0,
        ])
        expect(board.getSquareValidMovement(2,1,'up')).toEqual([0,1])
        expect(board.getSquareValidMovement(2,1,'right')).toEqual([2,3])
        board.loadPreset([
            0, 0, 0, 0,
            2, 0, 2, 0,
            0, 0, 0, 0,
            0, 0, 2, 0,
        ])
        expect(board.getSquareValidMovement(1,2,'down')).toEqual([3,2])
        expect(board.getSquareValidMovement(1,2,'left')).toEqual([1,0])
        
        // won't merge
        board.loadPreset([
            0, 4, 0, 0,
            0, 0, 0, 0,
            0, 2, 0, 4,
            0, 0, 0, 0,
        ])
        expect(board.getSquareValidMovement(2,1,'up')).toEqual([1,1])
        expect(board.getSquareValidMovement(2,1,'right')).toEqual([2,2])
        board.loadPreset([
            0, 0, 0, 0,
            4, 0, 2, 0,
            0, 0, 0, 0,
            0, 0, 4, 0,
        ])
        expect(board.getSquareValidMovement(1,2,'down')).toEqual([2,2])
        expect(board.getSquareValidMovement(1,2,'left')).toEqual([1,1])
        
    })

    test('must generate identical clone with no object reference', () => {
        const board = new Board(4,preset)
        const clone = board.clone()
        expect(board == clone).toBe(false)
        expect(clone.squares == board.squares).toBe(false)
        expect(clone.squares.map(x => x.value)).toEqual(board.squares.map(x => x.value))
    })
})