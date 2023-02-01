import { useKeypress } from 'vue3-keypress'
import { useSwipe } from '@/mixins/swipe'
import GameController from '@/model/2048/GameController'
import Direction from '@/model/2048/Direction'

const COMMAND_KEYS: { [key: string]: Direction } = {
  ArrowUp: Direction.Up,
  ArrowRight: Direction.Right,
  ArrowDown: Direction.Down,
  ArrowLeft: Direction.Left,
  right: Direction.Right,
  left: Direction.Left,
  top: Direction.Up,
  bottom: Direction.Down,
}

type BoardCommand = Direction | "undo"

export function useGameCommands(game: GameController, swipeTarget = '', moveCallback?: (dir: BoardCommand, success: boolean, pointsAdded: number) => void) {
  const COOLDOWN: {
    active: boolean,
    timeout: NodeJS.Timeout | null
  } = {
    active: false,
    timeout: null,
  }

  const canMove = (dir?: Direction) => {
    if (COOLDOWN.active) return false
    if (game.paused || game.gameOver || game.winner) return false
    return dir ? game.canMove[dir] : true
  }

  const startCooldown = () => {
    COOLDOWN.active = true
    if (COOLDOWN.timeout) clearTimeout(COOLDOWN.timeout)
    COOLDOWN.timeout = setTimeout(() => {
      COOLDOWN.active = false
    }, game.updateDelay)
  }

  const move = async (dir: Direction) => {
    let moved = false, pointsAdded = 0
    if (canMove(dir)) {
      startCooldown()
      const { success, pointsGained } = await game.move(dir)
      moved = success
      pointsAdded = pointsGained
    }
    if (moveCallback) moveCallback(dir, moved, pointsAdded)
  }

  const undo = async () => {
    if (!canMove()) return
    startCooldown()
    const {success, pointsLost} = await game.undo()
    if (moveCallback) moveCallback('undo', success, -pointsLost)
  }

  const keyboardCommand = (cmd: { event: { key: string } }) => {
    move(COMMAND_KEYS[cmd.event.key])
  }

  useKeypress({
    keyEvent: 'keydown',
    keyBinds: [
      'up',
      'down',
      'right',
      'left',
      'ArrowUp',
      'ArrowDown',
      'ArrowRight',
      'ArrowLeft',
    ].map((key) => ({
      keyCode: key,
      preventDefault: true,
      success: keyboardCommand,
    })),
  })

  if (swipeTarget) {
    const swipeCommand = (cmd: string) => {
      move(COMMAND_KEYS[cmd])
    }

    useSwipe(swipeTarget, swipeCommand)
  }

  return {
    move,
    undo,
    canMove,
  }
}
