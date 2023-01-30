import Square from "./Square";
import sleep from '../../utils/sleep'

describe('Square.ts', () => {
    test('must be created with correct position and value', () => {
        const sqr = new Square(1, 2)
        expect(sqr.value).toBe(0)
        expect(sqr.row).toBe(1)
        expect(sqr.col).toBe(2)
    })

    test('must get correct coordinates', () => {
        const sqr = new Square(1, 2)
        expect(sqr.coord).toBe('1, 2')
    })

    test('must update value correctly', () => {
        const sqr = new Square(1, 2)
        expect(sqr.value).toBe(0)
        sqr.setValue(2048)
        expect(sqr.value).toBe(2048)
    })

    test('must get correct state', () => {
        const sqr = new Square(1, 2)
        expect(sqr.isEmpty).toBe(true)
        sqr.setValue(2)
        expect(sqr.isEmpty).toBe(false)
    })

    test('must set next move correctly', () => {
        const sqr = new Square(0, 0)
        expect(sqr.nextMove).toEqual({
            reverse: false,
            vertical: 0,
            horizontal: 0,
        })
        sqr.setMove({ vertical: 3, horizontal: 1 })
        expect(sqr.nextMove).toEqual({
            reverse: false,
            vertical: 3,
            horizontal: 1,
        })

    })

    test('must set spawn correctly', async () => {
        const sqr = new Square(0, 0)
        sqr.setSpawn()
        expect(sqr.isSpawn).toEqual(true)
        
        sqr.isSpawn = false
        sqr.setSpawn(500)
        expect(sqr.isSpawn).toEqual(true)
        await sleep(500)
        expect(sqr.isSpawn).toEqual(false)

    })

    test('must generate identical clone with no object reference', () => {
        const sqr = new Square(0, 0)
        sqr.setMove(3, 1)
        sqr.setSpawn()
        const clone = sqr.clone()
        expect(sqr == clone).toBe(false)
        expect(clone).toEqual(sqr)
        clone.setValue(2)
        expect(sqr.value).toBe(0)
        expect(clone.value).toBe(2)
    })


})