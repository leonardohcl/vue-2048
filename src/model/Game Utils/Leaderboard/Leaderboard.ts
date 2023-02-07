import LeaderboardEntry, { ILeaderboardEntry } from './LeaderboardEntry'

export default class Leaderboard {
  private _key = 'v2048-leaderboards'
  private _size: number
  private _boards: {
    [key: string]: LeaderboardEntry[]
  }

  constructor(size = 10) {
    this._size = size
    this._boards = JSON.parse(localStorage.getItem(this._key) || '{}')
  }

  storeData() {
    localStorage.setItem(this._key, JSON.stringify(this._boards))
  }

  addEntry(boardId: string, entry: LeaderboardEntry) {
    if (!this.canJoinLeaderboard(boardId, entry.score))
      throw new NotFitForJoinLeaderboardError()

    if (this._boards[boardId]) {
      this._boards[boardId].push(entry)
      this._boards[boardId].sort((a, b) => b.score - a.score).splice(this._size)
    } else {
      this._boards[boardId] = [entry]
    }

    this.storeData()
  }

  canJoinLeaderboard(boardId: string, score: number) {
    const board = this._boards[boardId] || []
    const hasScore = score > 0
    const thereIsSpace = board.length < this._size
    const isBetterThanTheLast = score > board[board.length - 1]?.score ?? 0
    return hasScore && (thereIsSpace || isBetterThanTheLast)
  }

  getBoard(boardId: string) {
    return this._boards[boardId]
  }

  getBest(boardId: string) {
    const board = this._boards[boardId] || []
    return (
      board[0] ??
      new LeaderboardEntry({
        score: 0,
        block: 0,
        height: 0,
        moves: 0,
        undos: 0,
        width: 0,
        run: 0,
      })
    )
  }
}

class NotFitForJoinLeaderboardError extends Error {
  constructor() {
    super(
      `NotFitForJoinLeaderboardError: score is not high enough to be placed on the leaderboard`
    )
  }
}
