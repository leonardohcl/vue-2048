import LooseObject from '@/utils/LooseObject'

export default interface ISquare {
  row: number
  col: number
  value: number
  meta: LooseObject
}

export const enum SquareStateMeta {
  Merged = 'merged',
  Spawned = 'spawned',
  InvalidMove = 'invalidMove',
}
