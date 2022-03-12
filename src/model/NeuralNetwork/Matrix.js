const zerosArray = (len) => new Array(len).fill(0)

export default class Matrix {
    static zeros(rows, cols) {
        return zerosArray(rows).map(() => zerosArray(cols))
    }

    static random(rows, cols, min = -1, max = 1) {
        if (max <= min) throw `Invalid interval. Max must be greater than min, received min = ${min} and max = ${max}`
        return zerosArray(rows)
            .map(() => zerosArray(cols)
                .map(() => min + ((max - min) * Math.random())))
    }

    static multiply(matrix1, matrix2) {
        const {
            m,
            n: n1
        } = this.shape(matrix1);
        const {
            m: n2,
            n: o
        } = this.shape(matrix2);

        if (n1 !== n2) throw `Invalid matrix multiplication. Received matrix with shapes ${m}x${n1} and ${n2}x${o}`

        const result = this.zeros(m, o)

        for (let row = 0; row < m; row++) {
            const rowArr = matrix1[row]
            for (let col = 0; col < o; col++) {
                const colArr = this.getColAsArray(matrix2, col)
                for (let n = 0; n < n1; n++) {
                    result[row][col] += rowArr[n] * colArr[n]
                }
            }
        }

        return result;

    }

    static add(matrix1, matrix2) {
        const {
            m: m1,
            n: n1
        } = this.shape(matrix1);
        const {
            m: m2,
            n: n2
        } = this.shape(matrix2);

        if (m1 != m2 || n1 != n2)
            throw `Invalid sum. Received matrix with shapes ${m1}x${n1} and ${m1}x${n2}`

        const result = this.zeros(m1, n1)
        for (let x = 0; x < n1; x++) {
            for (let y = 0; y < m1; y++) {
                result[y][x] = matrix1[y][x] + matrix2[y][x]
            }
        }

        return result
    }

    static transpose(matrix) {
        const m = matrix.length,
            n = matrix[0].length

        const transposed = this.zeros(n, m)
        matrix.forEach((row, rowIdx) => {
            row.forEach((col, colIdx) => {
                transposed[colIdx][rowIdx] = col
            })
        });

        return transposed;
    }

    static getColAsArray(matrix, col) {
        return matrix.map(row => row[col])
    }

    static shape(matrix) {
        const m = matrix.length,
            n = matrix[0].length
        return {
            m,
            n
        }
    }

    static hasSameShape(matrix1, matrix2) {
        const {
            m: m1,
            n: n1
        } = this.shape(matrix1);
        const {
            m: m2,
            n: n2
        } = this.shape(matrix2);

        return (m1 === m2 && n1 === n2)
    }

    static crossover(matrix1, matrix2, crossoverPoint, mutationProbability = 0) {
        if (!Matrix.hasSameShape(matrix1, matrix2))
            throw "Can't crossover matrixes with different shapes";

        const {
            m,
            n
        } = this.shape(matrix1);

        const paramCount = m * n;
        let m1Count = Math.round(paramCount * crossoverPoint),
            m2Count = paramCount - m1Count;


        return matrix1.map((row, y) => {
            return row.map((col, x) => {
                if (mutationProbability && Math.random() < mutationProbability)
                    return -1 + (2 * Math.random())

                if (m1Count > 0 && Math.random() < crossoverPoint) {
                    m1Count--;
                    return col
                }

                if (m2Count > 0) {
                    m2Count--;
                    return matrix2[y][x]
                } else {
                    m1Count--;
                    return col
                }
            })
        })
    }

}