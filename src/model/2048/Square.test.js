import Square from "./Square";

describe('Square.ts', () => {
    test('must be created with correct position and value', () => {
        const sqr = new Square(1, 2)
        expect(sqr.value).toBe(0)
        expect(sqr.row).toBe(1)
        expect(sqr.col).toBe(2)
        expect(sqr.id).toBe("s1x2")
        expect(sqr.meta).toEqual({})
    })

    test('must update meta correctly', () => {
        const sqr = new Square(1, 2, 0, {test: 1})
        expect(sqr.meta.test).toBe(1)
        sqr.setMeta("test", 2)
        sqr.setMeta("new value", false)
        expect(sqr.meta.test).toBe(2)
        expect(sqr.meta["new value"]).toBe(false)
    })

    test('must set value correctly', () => {
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


    test('must generate identical snapshot with no object reference', () => {
        const sqr = new Square(0, 0)
        sqr.setMeta("test", 2)
        const snapshot = sqr.getSnapshot()
        expect(sqr == snapshot).toBe(false)
        expect(snapshot).toEqual(sqr)
        snapshot.setValue(2)
        expect(sqr.value).toBe(0)
        expect(snapshot.value).toBe(2)
    })


})